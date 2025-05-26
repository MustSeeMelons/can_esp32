#include "sd.h"

static const char *TAG = "SD";

static uint8_t max_mount_retries = 3;

static QueueHandle_t sd_queue_handle;

sdmmc_card_t *card;

static esp_err_t sd_mount_fs() {
    esp_err_t ret;

    // clang-format off
    esp_vfs_fat_sdmmc_mount_config_t mount_config = {
        .format_if_mount_failed = false,
        .max_files = 5
    };
    // clang-format on

    // TODO makingthis global just for testing
    // sdmmc_card_t *card;
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

    sdmmc_card_print_info(stdout, card);

    return ESP_OK;
}

static void sd_task(void *parameter) {
    for (;;) {
    }
}

esp_err_t sd_init() {
    esp_err_t ret = -1;
    uint8_t retries = 0;

    // while (ret != ESP_OK || retries >= max_mount_retries) {
    ret = sd_mount_fs();
    retries++;
    // }

    // clang-format off
    // xTaskCreatePinnedToCore(
    //     &sd_queue_handle,
    //     "sd_queue_handle",
    //     SD_TASK_STACK_SIZE,
    //     NULL,
    //     SD_TASK_PRIORITY,
    //     &sd_task,
    //     SD_TASK_CODE_ID
    // );
    // clang-format on

    // sd_queue_handle = xQueueCreate(3, sizeof(sd_message_t));

    return ret;
}

// XXX we can just pass in the enum value, no need to the wrapper
BaseType_t sd_send_message(sd_message_e msg_id) {
    sd_message_t msg;
    msg.msg_id = msg_id;

    return xQueueSend(sd_queue_handle, &msg, portMAX_DELAY);
}

// XXX task that reads file
// XXX same task - checks for file to read, taking from queue
// XXX place read data into a queue

// esp_err_t sd_read_test() {
//     const char *file_path = MOUNT_POINT "/dat_text.txt";

//     ESP_LOGI(TAG, "Reading file %s", file_path);
//     FILE *f = fopen(file_path, "r");
//     if (f == NULL) {
//         ESP_LOGE(TAG, "Failed to open file for reading");
//         return ESP_FAIL;
//     }

//     char line[256];
//     fgets(line, sizeof(line), f);
//     fclose(f);

//     // strip newline
//     char *pos = strchr(line, '\n');
//     if (pos) {
//         *pos = '\0';
//     }

//     ESP_LOGI(TAG, "Read from file: '%s'", line);

//     return ESP_OK;
// }