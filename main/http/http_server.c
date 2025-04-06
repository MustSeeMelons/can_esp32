#include "http_server.h"
#include <sys/stat.h>

#define MAX_CLIENTS 3

static const char TAG[] = "http_server";

// Keep track of WS clients
static ws_client_t clients[MAX_CLIENTS] = {0};
static int client_count = 0;

// TODO would be great to move to SPIFS
extern const uint8_t index_html_start[] asm("_binary_index_html_start");
extern const uint8_t index_html_end[] asm("_binary_index_html_end");

extern const uint8_t index_js_start[] asm("_binary_index_js_start");
extern const uint8_t index_js_end[] asm("_binary_index_js_end");

extern const uint8_t index_css_start[] asm("_binary_index_css_start");
extern const uint8_t index_css_end[] asm("_binary_index_css_end");

static httpd_handle_t http_server_handle = NULL;

static void add_client(httpd_handle_t handle, int sockfd) {
    for (int i = 0; i < MAX_CLIENTS; i++) {
        if (!clients[i].is_active) {
            clients[i].hd = handle;
            clients[i].fd = sockfd;
            clients[i].is_active = true;
            client_count++;

            ESP_LOGI(TAG, "Client added at index %d, total: %d", i, client_count);
            return;
        }
    }

    ESP_LOGW(TAG, "No free slots for new client");
}

static void remove_client(httpd_handle_t handle, int sockfd) {
    for (int i = 0; i < MAX_CLIENTS; i++) {
        if (clients[i].is_active && clients[i].hd == handle && clients[i].fd == sockfd) {
            clients[i].is_active = false;
            client_count--;

            ESP_LOGI(TAG, "Client removed at index %d, total: %d", i, client_count);
            break;
        }
    }
}

static esp_err_t httpd_server_index_html_handler(httpd_req_t *req) {
    ESP_LOGI(TAG, "index.html requested");

    httpd_resp_set_type(req, "text/html");
    httpd_resp_send(req, (const char *)index_html_start, index_html_end - index_html_start);

    return ESP_OK;
}

static esp_err_t httpd_server_index_js_handler(httpd_req_t *req) {
    ESP_LOGI(TAG, "index.js requested");

    httpd_resp_set_type(req, "application/javascript");
    httpd_resp_send(req, (const char *)index_js_start, index_js_end - index_js_start);

    return ESP_OK;
}

static esp_err_t httpd_server_index_css_handler(httpd_req_t *req) {
    ESP_LOGI(TAG, "index.css requested");

    httpd_resp_set_type(req, "text/css");
    httpd_resp_send(req, (const char *)index_css_start, index_css_end - index_css_start);

    return ESP_OK;
}

static esp_err_t ws_open_handler(httpd_req_t *req) {
    if (req->method == HTTP_GET) {
        ESP_LOGI(TAG, "WebSocker Handshake done!");

        int sockfd = httpd_req_to_sockfd(req);
        add_client(req->handle, sockfd);

        return ESP_OK;
    }

    // Setup memory for ws packet
    httpd_ws_frame_t ws_pkt;
    memset(&ws_pkt, 0, sizeof(httpd_ws_frame_t));
    ws_pkt.type = HTTPD_WS_TYPE_TEXT;

    // Receive the ws packet
    esp_err_t ret = httpd_ws_recv_frame(req, &ws_pkt, 0);

    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "httpd_ws_recv_frame failed with %d", ret);
        return ret;
    }

    // If we have a length, recieve the data
    if (ws_pkt.len) {
        // +1 for NULL terminator
        ws_pkt.payload = malloc(ws_pkt.len + 1);

        if (ws_pkt.payload == NULL) {
            ESP_LOGE(TAG, "Failed to allocate memory for WebSocket payload");
            return ESP_ERR_NO_MEM;
        }

        ret = httpd_ws_recv_frame(req, &ws_pkt, ws_pkt.len);

        if (ret != ESP_OK) {
            free(ws_pkt.payload);
            ESP_LOGE(TAG, "httpd_ws_recv_frame failed with %d", ret);
            return ret;
        }

        // Add NULL terminator
        ((uint8_t *)ws_pkt.payload)[ws_pkt.len] = 0;
        ESP_LOGI(TAG, "Received packet with message: %s", ws_pkt.payload);

        // XXX do something with the message

        // Send a response (echo back the received message)
        ret = httpd_ws_send_frame(req, &ws_pkt);

        free(ws_pkt.payload);

        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "httpd_ws_send_frame failed with %d", ret);
            return ret;
        }
    }

    return ESP_OK;
}

static void ws_close_handler(httpd_handle_t hd, int sockfd) {
    remove_client(hd, sockfd);
}

static httpd_handle_t http_server_configure(void) {
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();

    config.core_id = HTTP_SERVER_TASK_CORE_ID;
    config.task_priority = HTTP_SERVER_TASK_PRIORITY;
    config.stack_size = HTTP_SERVER_TASK_STACK_SIZE;
    config.max_uri_handlers = 20;
    config.recv_wait_timeout = 10;
    config.send_wait_timeout = 10;
    config.close_fn = ws_close_handler;

    ESP_LOGI(TAG,
             "http_server_configure: Starting server on port: '%d' with task priority: '%d'",
             config.server_port,
             config.task_priority);

    if (httpd_start(&http_server_handle, &config) == ESP_OK) {
        ESP_LOGI(TAG, "http_server_configure: Registering URI handlers");

        // clang-format off
        httpd_uri_t index_html = {
            .uri = "/",
            .method = HTTP_GET,
            .handler = httpd_server_index_html_handler,
            .user_ctx = NULL
        };
        
        httpd_register_uri_handler(http_server_handle, &index_html);

        httpd_uri_t index_css = {
            .uri = "/index.css", 
            .method = HTTP_GET,
            .handler = httpd_server_index_css_handler,
            .user_ctx = NULL
        };

        httpd_register_uri_handler(http_server_handle, &index_css);

        httpd_uri_t index_js = {
            .uri = "/index.js",
            .method = HTTP_GET,
            .handler = httpd_server_index_js_handler,
            .user_ctx = NULL
        };

        httpd_register_uri_handler(http_server_handle, &index_js);

        httpd_uri_t ws = {
            .uri       = "/ws",
            .method    = HTTP_GET,
            .handler   = ws_open_handler,
            .user_ctx  = NULL,
            .is_websocket = true
        };

        httpd_register_uri_handler(http_server_handle, &ws);

        // clang-format on

        // httpd_uri_t favicon_ico = {
        //     .uri = "/favicon.ico", .method = HTTP_GET, .handler = httpd_server_favicon_ico_handler, .user_ctx =
        //     NULL};

        // httpd_register_uri_handler(http_server_handle, &favicon_ico);

        return http_server_handle;
    }

    return NULL;
}

void ws_broadcast_message(void *data, uint8_t len) {
    httpd_ws_frame_t ws_pkt;
    memset(&ws_pkt, 0, sizeof(httpd_ws_frame_t));
    ws_pkt.payload = (uint8_t *)data;
    ws_pkt.len = len;
    ws_pkt.type = HTTPD_WS_TYPE_BINARY;

    for (int i = 0; i < MAX_CLIENTS; i++) {
        if (clients[i].is_active) {
            httpd_ws_send_frame_async(clients[i].hd, clients[i].fd, &ws_pkt);
        }
    }
}

void http_server_init(void) {
    if (http_server_handle == NULL) {
        http_server_handle = http_server_configure();
    }
}