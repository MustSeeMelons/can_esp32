#include "sd.h"

static const char *TAG = "SD";

static uint8_t max_mount_retries = 3;

// For recieving files to read
static QueueHandle_t sd_command_queue_handle = NULL;
static TaskHandle_t sd_task_handle = NULL;

static esp_err_t sd_mount_fs() {
    esp_err_t ret;

    // clang-format off
    esp_vfs_fat_sdmmc_mount_config_t mount_config = {
        .format_if_mount_failed = false,
        .max_files = 5
    };
    // clang-format on

    sdmmc_card_t *card;
    const char mount_point[] = MOUNT_POINT;
    ESP_LOGI(TAG, "Initializing SD card");

    sdmmc_host_t host = SDSPI_HOST_DEFAULT();

    spi_bus_config_t bus_cfg = {
        .mosi_io_num = SPI_MOSI,
        .miso_io_num = SPI_MISO,
        .sclk_io_num = SPI_SCK,
        .quadwp_io_num = -1,
        .quadhd_io_num = -1,
        .max_transfer_sz = 2048,
    };

    ret = spi_bus_initialize(host.slot, &bus_cfg, SDSPI_DEFAULT_DMA);

    if (ret != ESP_OK) {
        ESP_LOGI(TAG, "Failed to initialize SPI");
        return ret;
    } else {
        ESP_LOGI(TAG, "SPI initialized");
    }

    sdspi_device_config_t slot_config = SDSPI_DEVICE_CONFIG_DEFAULT();
    slot_config.gpio_cs = SD_CS;
    slot_config.host_id = host.slot;

    ret = esp_vfs_fat_sdspi_mount(mount_point, &host, &slot_config, &mount_config, &card);

    if (ret != ESP_OK) {
        ESP_LOGI(TAG, "Failed to mount FS");
        return ret;
    } else {
        ESP_LOGI(TAG, "FS mounted");
    }

    // sdmmc_card_print_info(stdout, card);

    return ESP_OK;
}

static void sd_task(void *pvParameter) {
    sd_message_t msg;

    for (;;) {
        if (xQueueReceive(sd_command_queue_handle, &msg, portMAX_DELAY)) {
            switch (msg.msg_id) {
            case SD_READ_FILE:
                char full_path[MAX_PATH];
                snprintf(full_path, sizeof(full_path), "%s/%s", MOUNT_POINT, msg.filename);

                FILE *f = fopen(full_path, "rb");

                if (!f) {
                    ESP_LOGI(TAG, "Failed to open file! %s", full_path);
                    break;
                }

                ESP_LOGI(TAG, "Playing: %s", full_path);

                // TODO read header and re-configure i2s
                fseek(f, 0, SEEK_SET);
                uint8_t header[44];
                fread(header, 1, 44, f);

                while (true) {
                    i2s_audio_message_t msg;

                    BaseType_t status = audio_get_free_buffer(&msg);

                    if (status == pdFALSE) {
                        ESP_LOGI(TAG, "SD Failed to get free buffer");
                        vTaskDelay(1);
                        continue;
                    }

                    size_t bytes_read = fread(msg.bytes, sizeof(uint8_t), BUFFER_SIZE, f);
                    msg.len = bytes_read;

                    i2s_send_audio_buffer(msg);

                    if (bytes_read == 0) {
                        break;
                    }

                    vTaskDelay(1);
                }

                fclose(f);

                break;
            default:
                break;
            }
        }
    }
}

esp_err_t sd_init() {
    esp_err_t ret = -1;
    uint8_t retries = 0;

    while (ret != ESP_OK || retries >= max_mount_retries) {
        ret = sd_mount_fs();
        retries++;
    }

    if (ret != ESP_OK) {
        return ret;
    }

    sd_command_queue_handle = xQueueCreate(3, sizeof(sd_message_t));

    // clang-format off
    xTaskCreatePinnedToCore(
        &sd_task,
        "sd_task",
        SD_TASK_STACK_SIZE,
        NULL,
        SD_TASK_PRIORITY,
        &sd_task_handle,
        SD_TASK_CODE_ID
    );
    // clang-format on

    return ret;
}

BaseType_t sd_send_message(sd_message_t msg) {
    return xQueueSend(sd_command_queue_handle, &msg, portMAX_DELAY);
}
