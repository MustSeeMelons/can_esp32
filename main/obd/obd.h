#ifndef OBD_H_
#define OBD_H_

#include "driver/twai.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "string.h"
#include <stdio.h>

void obd_init(void);

void obd_task_start(void);

#endif