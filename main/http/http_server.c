#include "http_server.h"
#include <sys/stat.h>

static const char TAG[] = "http_server";

// TODO would be great to move to SPIFS
extern const uint8_t index_html_start[] asm("_binary_index_html_start");
extern const uint8_t index_html_end[] asm("_binary_index_html_end");

extern const uint8_t index_js_start[] asm("_binary_index_js_start");
extern const uint8_t index_js_end[] asm("_binary_index_js_end");

extern const uint8_t index_css_start[] asm("_binary_index_css_start");
extern const uint8_t index_css_end[] asm("_binary_index_css_end");

static httpd_handle_t http_server_handle = NULL;

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

static httpd_handle_t http_server_configure(void) {
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();

    config.core_id = HTTP_SERVER_TASK_CORE_ID;
    config.task_priority = HTTP_SERVER_TASK_PRIORITY;
    config.stack_size = HTTP_SERVER_TASK_STACK_SIZE;
    config.max_uri_handlers = 20;
    config.recv_wait_timeout = 10; // seconds
    config.send_wait_timeout = 10;

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
        // clang-format on

        // httpd_uri_t favicon_ico = {
        //     .uri = "/favicon.ico", .method = HTTP_GET, .handler = httpd_server_favicon_ico_handler, .user_ctx =
        //     NULL};

        // httpd_register_uri_handler(http_server_handle, &favicon_ico);

        return http_server_handle;
    }

    return NULL;
}

void http_server_init(void) {
    if (http_server_handle == NULL) {
        http_server_handle = http_server_configure();
    }
}