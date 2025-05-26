#ifndef SD_H_
#define SD_H_

#include "esp_err.h"
#include "esp_log.h"
#include "sdmmc_cmd.h"
#include "tasks_common.h"
#include <esp_vfs_fat.h>
#include <string.h>

#define SD_CS    5
#define SPI_MOSI 23
#define SPI_MISO 19
#define SPI_SCK  18

#define MOUNT_POINT "/sd"

typedef enum sd_message {
    SD_READ_FILE = 0,
} sd_message_e;

typedef struct sd_queue_message {
    sd_message_e msg_id;
} sd_message_t;

esp_err_t sd_init();

BaseType_t sd_send_message(sd_message_e msg_id);

#endif