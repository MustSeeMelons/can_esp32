#include <stdio.h>
#include "driver/twai.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "obd/obd.h"

void app_main()
{
    obd_init();

    obd_task_start();
}