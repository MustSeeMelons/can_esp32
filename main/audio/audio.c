#include "audio.h"

// I2S buffers are recomended to by 4 byte aligned
static uint8_t buffers[BUFFER_COUNT][BUFFER_SIZE] __attribute__((aligned(4)));

QueueHandle_t buffer_queue_handle;
QueueHandle_t free_buffer_queue_handle;

void audio_init() {
    buffer_queue_handle = xQueueCreate(BUFFER_COUNT, sizeof(i2s_audio_message_t));
    free_buffer_queue_handle = xQueueCreate(BUFFER_COUNT, sizeof(i2s_audio_message_t));

    // Fill the free buffer
    for (uint8_t i = 0; i < BUFFER_COUNT; i++) {
        i2s_audio_message_t msg;
        msg.msg_id = AUDIO_CHUNK;
        msg.bytes = buffers[i];
        msg.len = 0;

        xQueueSend(free_buffer_queue_handle, &msg, portMAX_DELAY);
    }
}

void audio_play_wav(const char *filename) {
    sd_message_t msg = {.msg_id = SD_READ_FILE, filename = filename};

    sd_send_message(msg);
}

/**
 * Returns a free `i2s_audio_message_t` ready for usage if available.
 */
BaseType_t audio_get_free_buffer(i2s_audio_message_t *msg) {
    return xQueueReceive(free_buffer_queue_handle, msg, portMAX_DELAY);
}

/**
 * Returns a `i2s_audio_message_t` to be used once more later.
 */
BaseType_t audio_add_free_buffer(i2s_audio_message_t *msg) {
    return xQueueSend(free_buffer_queue_handle, msg, portMAX_DELAY);
}