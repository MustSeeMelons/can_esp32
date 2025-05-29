#include "i2s.h"

static const char *TAG = "I2S";

static QueueHandle_t audio_queue_handle;
static TaskHandle_t audio_task_handle = NULL;

static i2s_chan_handle_t tx_handle;

static void audio_task(void *parameter) {
    i2s_audio_message_t msg;

    for (;;) {
        if (xQueueReceive(audio_queue_handle, &msg, portMAX_DELAY)) {
            switch (msg.msg_id) {
            case AUDIO_CHUNK:
                if (msg.bytes != NULL) {
                    size_t bytes_written;
                    i2s_channel_write(tx_handle, msg.bytes, msg.len, &bytes_written, portMAX_DELAY);
                } else {
                    ESP_LOGI(TAG, "Finished playback");
                }
                break;
            default:
                break;
            }
        }

        vTaskDelay(1);
    }
}

void i2s_init() {
    // clang-format off
    i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);
    ESP_ERROR_CHECK(i2s_new_channel(&chan_cfg, &tx_handle, NULL));

    i2s_std_config_t std_cfg = {
        .clk_cfg = I2S_STD_CLK_DEFAULT_CONFIG(22050),
        .slot_cfg = {
            .data_bit_width = I2S_DATA_BIT_WIDTH_16BIT,
            .slot_bit_width = I2S_SLOT_BIT_WIDTH_16BIT,
            .slot_mode = I2S_SLOT_MODE_STEREO,
            .ws_pol = false,
            .bit_shift = true,
            .msb_right = false,
        },
        .gpio_cfg = {
            .mclk = I2S_GPIO_UNUSED,
            .bclk = I2S_BCLK,
            .ws = I2S_LRC,
            .dout = I2S_DOUT,
            .din = I2S_GPIO_UNUSED
        },
    };

    ESP_ERROR_CHECK(i2s_channel_init_std_mode(tx_handle, &std_cfg));
    ESP_ERROR_CHECK(i2s_channel_enable(tx_handle));

    audio_queue_handle = xQueueCreate(BUFFER_COUNT, sizeof(i2s_audio_message_t));

    xTaskCreatePinnedToCore(
        &audio_task,
        "audio_task",
        I2S_TASK_STACK_SIZE,
        NULL,
        I2S_TASK_PRIORITY,
        &audio_task_handle,
        I2S_TASK_CODE_ID
    );
    // clang-format on

    ESP_LOGI(TAG, "Initialized");
}

BaseType_t i2s_send_message(i2s_audio_message_t msg) {
    return xQueueSend(audio_queue_handle, &msg, portMAX_DELAY);
}

void i2s_play_wav(const char *filename) {
    sd_message_t msg = {.msg_id = SD_READ_FILE, filename = filename};

    sd_send_message(msg);
}
