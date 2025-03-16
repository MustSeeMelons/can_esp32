#include "mdns_service.h"

static const char *hostname = "obd2";

void mnds_init()
{
    ESP_ERROR_CHECK(mdns_init());
    ESP_ERROR_CHECK(mdns_hostname_set(hostname));
    ESP_ERROR_CHECK(mdns_instance_name_set("obd2"));
    ESP_ERROR_CHECK(mdns_service_add("obd2", "_http", "_tcp", 80, NULL, 0));
}