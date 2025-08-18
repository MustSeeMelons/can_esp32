#ifndef OBD_H_
#define OBD_H_

#define OBD_SEND_BUFF_COUNT 2

// TX => RX, RX => TX of TJA
#define TX_PIN GPIO_NUM_32
#define RX_PIN GPIO_NUM_33

#include "driver/twai.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "string.h"
#include <stdio.h>

typedef struct {
    uint32_t identifier;
    uint8_t data[8];
} can_message_t;

void obd_init(void);

void obd_task_start(void);

void obd_can_send(can_message_t message);

void obd_clear_dtc();

void obd_request_rpm();

#endif