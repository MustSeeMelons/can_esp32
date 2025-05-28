#ifndef I2S_H_
#define I2S_H_

#include "driver/i2s_std.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#define I2S_NUM I2S_NUM_0

#define I2S_DOUT 22
#define I2S_BCLK 26
#define I2S_LRC  25

// XXX use sd queue to get data
// XXX write to i2s

void i2s_init();

#endif