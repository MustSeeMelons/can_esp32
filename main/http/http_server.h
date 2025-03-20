#ifndef HTTP_SERVER_H_
#define HTTP_SERVER_H_

#include "esp_http_server.h"
#include "esp_log.h"
#include "http_server.h"
#include "stdint.h"
#include "tasks_common.h"

typedef struct {
    httpd_handle_t hd;
    int fd;
    bool is_active;
} ws_client_t;

void http_server_init(void);

void ws_broadcast_message(void *data, uint8_t len);

#endif