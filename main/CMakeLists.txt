idf_component_register(
    SRCS "main.c" "obd/obd.c" "http/http_server.c" "wifi/wifi.c" "mdns_service/mdns_service.c" "sd/sd.c" "i2s/i2s.c" "audio/audio.c"
    INCLUDE_DIRS "."
    EMBED_FILES "web/dist/index.html" "web/dist/index.css" "web/dist/index.js"
)