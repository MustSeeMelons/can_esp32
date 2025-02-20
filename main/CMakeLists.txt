idf_component_register(
    SRCS "main.c" "obd/obd.c" "http/http_server.c" "wifi/wifi.c"
    INCLUDE_DIRS "."
    EMBED_FILES "web/index.html"
)