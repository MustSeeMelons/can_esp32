#include "i2s.h"
#include "sdmmc_cmd.h"

i2s_chan_handle_t tx_handle;

extern sdmmc_card_t *card;

void i2s_init() {
    // clang-format off
    i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);
    ESP_ERROR_CHECK(i2s_new_channel(&chan_cfg, &tx_handle, NULL));

    i2s_std_config_t std_cfg = {
        .clk_cfg = I2S_STD_CLK_DEFAULT_CONFIG(22050),
        .slot_cfg = {
            .data_bit_width = I2S_DATA_BIT_WIDTH_16BIT,
            .slot_bit_width = I2S_SLOT_BIT_WIDTH_16BIT,
            .slot_mode = I2S_SLOT_MODE_STEREO,
            .slot_mask = I2S_STD_SLOT_LEFT | I2S_STD_SLOT_RIGHT,
            .ws_width = I2S_SLOT_BIT_WIDTH_16BIT,
            .ws_pol = false,
            .bit_shift = true,
            .msb_right = false,
        },
        .gpio_cfg = {
            .mclk = I2S_GPIO_UNUSED,
            .bclk = I2S_BCLK,
            .ws = I2S_LRC,
            .dout = I2S_DOUT,
            .din = I2S_GPIO_UNUSED
        },
    };

    ESP_ERROR_CHECK(i2s_channel_init_std_mode(tx_handle, &std_cfg));
    ESP_ERROR_CHECK(i2s_channel_enable(tx_handle));
}

void i2s_test() {
    FILE* f = fopen("/sd/oxp.wav", "rb");
    if (!f) {
        printf("Failed to open WAV file\n");
        return;
    }

    fseek(f, 0, SEEK_SET);
    uint8_t header[44];
    fread(header, 1, 44, f);

    uint8_t buffer[1024];
    size_t bytes_read;

    while ((bytes_read = fread(buffer, 1, sizeof(buffer), f)) > 0) {
        size_t bytes_written;
        i2s_channel_write(tx_handle, buffer, bytes_read, &bytes_written, portMAX_DELAY);
    }

    fclose(f);
}