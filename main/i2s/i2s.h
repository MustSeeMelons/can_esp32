#ifndef I2S_H_
#define I2S_H_

#include "audio/audio.h"
#include "definitions.h"
#include "driver/i2s_std.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "stdint.h"

#define I2S_NUM I2S_NUM_0

#define I2S_DOUT 22
#define I2S_BCLK 26
#define I2S_LRC  25

void i2s_init();

void i2s_play_wav(const char *filename);

BaseType_t i2s_send_audio_buffer(i2s_audio_message_t msg);

#endif