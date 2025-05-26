#ifndef OBD_H_
#define OBD_H_

// TX => RX, RX => TX of TJA
#define TX_PIN GPIO_NUM_32
#define RX_PIN GPIO_NUM_33

#include "driver/twai.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "string.h"
#include <stdio.h>

void obd_init(void);

void obd_task_start(void);

void obd_can_send(uint8_t msg_id);

#endif