#ifndef SD_H_
#define SD_H_

#include "audio/audio.h"
#include "definitions.h"
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

#define MAX_PATH 128

esp_err_t sd_init();

BaseType_t sd_send_message(sd_message_t msg);

#endif