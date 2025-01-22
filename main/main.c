#include <stdio.h>
#include "driver/twai.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

void app_main()
{
    // Configure TWAI general settings
    twai_general_config_t general_config = {
        .mode = TWAI_MODE_NORMAL,
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
    if (twai_driver_install(&general_config, &timing_config, &filter_config) == ESP_OK)
    {
        printf("TWAI driver installed\n");
    }
    else
    {
        printf("Failed to install TWAI driver\n");
        return;
    }

    // Start the TWAI driver
    if (twai_start() == ESP_OK)
    {
        printf("TWAI driver started\n");
    }
    else
    {
        printf("Failed to start TWAI driver\n");
        return;
    }

    // Main loop to receive TWAI messages
    while (true)
    {
        twai_message_t message;
        if (twai_receive(&message, pdMS_TO_TICKS(1000)) == ESP_OK)
        {
            printf("Message received: ID=0x%X, Data=", (unsigned int)message.identifier);
            for (int i = 0; i < message.data_length_code; i++)
            {
                printf("0x%02X ", message.data[i]);
            }
            printf("\n");
        }
        else
        {
            printf("No message received within timeout\n");
        }
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}