#ifndef DEFINITIONS_H_
#define DEFINITIONS_H_

#include "stdint.h"

typedef enum i2s_message
{ AUDIO_CHUNK = 0, } i2s_message_e;

typedef struct i2s_audio_message {
    i2s_message_e msg_id;
    uint16_t len;
    uint8_t *bytes;
} i2s_audio_message_t;

typedef enum sd_message
{ SD_READ_FILE = 0 } sd_message_e;

typedef struct sd_queue_message {
    sd_message_e msg_id;
    const char *filename;
} sd_message_t;

#endif