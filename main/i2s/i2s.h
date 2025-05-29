#ifndef I2S_H_
#define I2S_H_

#include "driver/i2s_std.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "sd/sd.h"
#include "stdint.h"

#define I2S_NUM I2S_NUM_0

#define I2S_DOUT 22
#define I2S_BCLK 26
#define I2S_LRC  25

typedef enum i2s_message {
    AUDIO_CHUNK = 0,
} i2s_message_e;

typedef struct i2s_audio_message {
    i2s_message_e msg_id;
    uint16_t len;
    uint8_t *bytes;
} i2s_audio_message_t;

void i2s_init ();

void i2s_play_wav (const char *filename);

BaseType_t i2s_send_message (i2s_audio_message_t msg);

#endif