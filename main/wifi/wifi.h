#ifndef WIFI_H_
#define WIFI_H_

#include "esp_mac.h"
#include "esp_netif.h"
#include "esp_wifi.h"
#include "lwip/netdb.h"

#define WIFI_AP_SSID               "ESP32_AP"
#define WIFI_AP_PASSWORD           "password"
#define WIFI_AP_CHANNEL            1
#define WIFI_AP_SSID_HIDDEN        0
#define WIFI_AP_MAX_CONNECTIONS    5
#define WIFI_AP_BEACON_INTERVAL    100 // ms, as recommended
#define WIFI_AP_IP                 "192.168.0.1"
#define WIFI_AP_GATEWAY            "192.168.0.1"
#define WIFI_AP_NETMASK            "255.255.255.0"
#define WIFI_AP_BANDWIDTH          WIFI_BW_HT20 // or 40, 20 less speed less interference
#define WIFI_AP_POWER_SAVE         WIFI_PS_NONE
#define WIFI_AP_SSID_LENGTH        32 // IEEE standard max
#define WIFI_AP_PASSWORD_LENGTH    64 // IEEE standard max
#define WIFI_AP_CONNECTION_RETRIES 5  // on disconnect

void wifi_init(void);

#endif