#ifndef OBD_H_
#define OBD_H_

#include <stdio.h>
#include "driver/twai.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

void obd_init(void);

void obd_task_start(void);

#endif