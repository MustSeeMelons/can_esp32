#include "http_server.h"

static const char TAG[] = "http_server";

extern const uint8_t index_html_start[] asm("_binary_index_html_start");
extern const uint8_t index_html_end[] asm("_binary_index_html_end");

static httpd_handle_t http_server_handle = NULL;

static esp_err_t httpd_server_index_html_handler(httpd_req_t *req)
{
    ESP_LOGI(TAG, "index.html requested");

    httpd_resp_set_type(req, "text/html");
    httpd_resp_send(req, (const char *)index_html_start, index_html_end - index_html_start);

    return ESP_OK;
}

static httpd_handle_t http_server_configure(void)
{
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();

    config.core_id = HTTP_SERVER_TASK_CORE_ID;
    config.task_priority = HTTP_SERVER_TASK_PRIORITY;
    config.stack_size = HTTP_SERVER_TASK_STACK_SIZE;
    config.max_uri_handlers = 20;
    config.recv_wait_timeout = 10; // seconds
    config.send_wait_timeout = 10;

    ESP_LOGI(TAG, "http_server_configure: Starting server on port: '%d' with task priority: '%d'", config.server_port,
             config.task_priority);

    if (httpd_start(&http_server_handle, &config) == ESP_OK)
    {
        ESP_LOGI(TAG, "http_server_configure: Registering URI handlers");

        httpd_uri_t index_html = {
            .uri = "/", .method = HTTP_GET, .handler = httpd_server_index_html_handler, .user_ctx = NULL};

        httpd_register_uri_handler(http_server_handle, &index_html);

        // XXX add onc we have them
        // httpd_uri_t app_css = {
        //     .uri = "/app.css", .method = HTTP_GET, .handler = httpd_server_app_css_handler, .user_ctx = NULL};

        // httpd_register_uri_handler(http_server_handle, &app_css);

        // httpd_uri_t app_js = {
        //     .uri = "/app.js", .method = HTTP_GET, .handler = httpd_server_app_js_handler, .user_ctx = NULL};

        // httpd_register_uri_handler(http_server_handle, &app_js);

        // httpd_uri_t favicon_ico = {
        //     .uri = "/favicon.ico", .method = HTTP_GET, .handler = httpd_server_favicon_ico_handler, .user_ctx =
        //     NULL};

        // httpd_register_uri_handler(http_server_handle, &favicon_ico);

        return http_server_handle;
    }

    return NULL;
}

void http_server_init(void)
{
    if (http_server_handle == NULL)
    {
        http_server_handle = http_server_configure();
    }
}