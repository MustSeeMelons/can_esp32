#include "wifi.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include <string.h>

// No need for a task unless we want to interact with the WiFi

esp_netif_t *esp_netif_ap = NULL;

static const char *TAG_AP = "WiFi SoftAP";

static void wifi_event_handler(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data)
{
    if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_AP_STACONNECTED)
    {
        wifi_event_ap_staconnected_t *event = (wifi_event_ap_staconnected_t *)event_data;
        ESP_LOGI(TAG_AP, "Device " MACSTR " joined, MAC=%d", MAC2STR(event->mac), event->aid);
    }
    else if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_AP_STADISCONNECTED)
    {
        wifi_event_ap_stadisconnected_t *event = (wifi_event_ap_stadisconnected_t *)event_data;
        ESP_LOGI(TAG_AP, "Device " MACSTR " left, MAC=%d", MAC2STR(event->mac), event->aid);
    }
}

static esp_netif_t *wifi_init_softap(void)
{
    esp_netif_t *esp_netif_ap = esp_netif_create_default_wifi_ap();

    wifi_config_t wifi_ap_config = {
        .ap =
            {
                .ssid = WIFI_AP_SSID,
                .ssid_len = strlen(WIFI_AP_SSID),
                .channel = WIFI_AP_CHANNEL,
                .password = WIFI_AP_PASSWORD,
                .max_connection = WIFI_AP_MAX_CONNECTIONS,
                .authmode = WIFI_AUTH_WPA2_PSK,
                .pmf_cfg =
                    {
                        .required = false,
                    },
            },
    };

    if (strlen(WIFI_AP_PASSWORD) == 0)
    {
        wifi_ap_config.ap.authmode = WIFI_AUTH_OPEN;
    }

    esp_netif_ip_info_t ap_ip_info;
    memset(&ap_ip_info, 0x00, sizeof(ap_ip_info));

    // Need to stop DHCP before configuring it
    esp_netif_dhcps_stop(esp_netif_ap);

    // Configure AP IP
    inet_pton(AF_INET, WIFI_AP_IP, &ap_ip_info.ip);
    inet_pton(AF_INET, WIFI_AP_GATEWAY, &ap_ip_info.gw);
    inet_pton(AF_INET, WIFI_AP_NETMASK, &ap_ip_info.netmask);

    // Set IP config and start DHCPS
    ESP_ERROR_CHECK(esp_netif_set_ip_info(esp_netif_ap, &ap_ip_info));
    ESP_ERROR_CHECK(esp_netif_dhcps_start(esp_netif_ap));

    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_AP));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_AP, &wifi_ap_config));
    ESP_ERROR_CHECK(esp_wifi_set_bandwidth(ESP_IF_WIFI_AP, WIFI_AP_BANDWIDTH));

    ESP_ERROR_CHECK(esp_wifi_set_ps(WIFI_AP_POWER_SAVE));

    ESP_LOGI(TAG_AP, "wifi_init_softap finished. SSID:%s password:%s channel:%d", WIFI_AP_SSID, WIFI_AP_PASSWORD,
             WIFI_AP_CHANNEL);

    return esp_netif_ap;
}

void wifi_init(void)
{
    // Initialize the TCP/IP stack
    ESP_ERROR_CHECK(esp_netif_init());
    // Event loop for WiFi
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    // Initialize NVS, for callibration data
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
    {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    // Register Event handlers
    ESP_ERROR_CHECK(esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, NULL, NULL));

    // Initialize WiFi
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    cfg.nvs_enable = 0;

    ESP_ERROR_CHECK(esp_wifi_init(&cfg));

    // Initialize AP
    ESP_LOGI(TAG_AP, "ESP_WIFI_MODE_AP");
    esp_netif_ap = wifi_init_softap();

    ESP_ERROR_CHECK(esp_wifi_start());
}
