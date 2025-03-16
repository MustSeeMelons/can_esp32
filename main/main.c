#include "driver/twai.h"
#include "esp_spiffs.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <stdio.h>

#include "http/http_server.h"
#include "mdns_service/mdns_service.h"
#include "obd/obd.h"
#include "wifi/wifi.h"

void app_main() {
    obd_init();

    obd_task_start();

    wifi_init();

    http_server_init();

    mnds_init();
}