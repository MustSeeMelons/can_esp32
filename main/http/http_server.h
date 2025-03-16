#ifndef HTTP_SERVER_H_
#define HTTP_SERVER_H_

#include "esp_http_server.h"
#include "esp_log.h"
#include "http_server.h"
#include "stdint.h"
#include "tasks_common.h"

void http_server_init(void);

#endif