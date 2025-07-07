#include "driver/twai.h"
#include "esp_spiffs.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <stdio.h>

#include "audio/audio.h"
#include "http/http_server.h"
#include "i2s/i2s.h"
#include "mdns_service/mdns_service.h"
#include "obd/obd.h"
#include "sd/sd.h"
#include "wifi/wifi.h"

// TODO add err check for the rest of inits
void app_main() {
    esp_err_t ret = -1;

    ret = sd_init();

    if (ret != ESP_OK) {
        return;
    }

    audio_init();

    i2s_init();

    obd_init();

    obd_task_start();

    wifi_init();

    http_server_init();

    mnds_init();

    // xp_shutdown, XXX this does not play for some reason
    audio_play_wav("xp_logon.wav");
}