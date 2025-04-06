#include "obd.h"
#include "../http/http_server.h"
#include "../tasks_common.h"

static const uint8_t ws_size = 4 + 1 + 8;

void obd_init(void) {
    // Configure TWAI general settings
    twai_general_config_t general_config = {.mode = TWAI_MODE_NORMAL,
                                            .tx_io = GPIO_NUM_21, // TX pin
                                            .rx_io = GPIO_NUM_22, // RX pin
                                            .clkout_io = TWAI_IO_UNUSED,
                                            .bus_off_io = TWAI_IO_UNUSED,
                                            .tx_queue_len = 10,
                                            .rx_queue_len = 10,
                                            .alerts_enabled = TWAI_ALERT_NONE,
                                            .clkout_divider = 0};

    // Configure TWAI timing for 500kbps
    twai_timing_config_t timing_config = TWAI_TIMING_CONFIG_500KBITS();

    // Accept all incoming messages
    twai_filter_config_t filter_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();

    // Install the TWAI driver
    if (twai_driver_install(&general_config, &timing_config, &filter_config) == ESP_OK) {
        printf("TWAI driver installed\n");
    } else {
        printf("Failed to install TWAI driver\n");
        return;
    }

    // Start the TWAI driver
    if (twai_start() == ESP_OK) {
        printf("TWAI driver started\n");
    } else {
        printf("Failed to start TWAI driver\n");
        return;
    }
}

static void obd_task(void *pvParameter) {
    printf("Starting OBD task\n\n");

    for (;;) {
        twai_message_t message;
        if (twai_receive(&message, pdMS_TO_TICKS(1000)) == ESP_OK) {
            // Log the message for debugging
            printf("Message received: ID=0x%X, Data=", (unsigned int)message.identifier);

            for (int i = 0; i < message.data_length_code; i++) {
                printf("0x%02X ", message.data[i]);
            }
            printf("\n");

            // Broadcast to clients
            uint8_t ws_msg[ws_size];
            ws_msg[0] = (uint8_t)(message.identifier & 0xFF);
            ws_msg[1] = (uint8_t)((message.identifier >> 8) & 0xFF);
            ws_msg[2] = (uint8_t)((message.identifier >> 16) & 0xFF);
            ws_msg[3] = (uint8_t)((message.identifier >> 24) & 0xFF);

            ws_msg[4] = message.data_length_code;

            for (uint8_t i = 0; i < TWAI_FRAME_MAX_DLC; i++) {
                ws_msg[5 + i] = (i < message.data_length_code) ? message.data[i] : 0;
            }

            ws_broadcast_message((void *)ws_msg, ws_size);
        }

        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

void obd_task_start(void) {
    xTaskCreatePinnedToCore(&obd_task, "OBD", OBD_TASK_STACK_SIZE, NULL, OBD_TASK_PRIORITY, NULL, OBD_TASK_CORE_ID);
}