#include "driver/twai.h"
#include "esp_spiffs.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <stdio.h>

#include "http/http_server.h"
#include "i2s/i2s.h"
#include "mdns_service/mdns_service.h"
#include "obd/obd.h"
#include "sd/sd.h"
#include "wifi/wifi.h"

void app_main() {
    sd_init();

    i2s_init();

    i2s_play_wav("oxp.wav");

    // obd_init();

    // obd_task_start();

    // wifi_init();

    // http_server_init();

    // mnds_init();
}