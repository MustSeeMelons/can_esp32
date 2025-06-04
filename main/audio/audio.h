#ifndef AUDIO_H_
#define AUDIO_H_

#include "definitions.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "i2s/i2s.h"
#include "sd/sd.h"

#define BUFFER_COUNT 4
#define BUFFER_SIZE  4096

void audio_init();

void audio_play_wav(const char *filename);

BaseType_t audio_get_free_buffer(i2s_audio_message_t *msg);

BaseType_t audio_add_free_buffer(i2s_audio_message_t *msg);

#endif