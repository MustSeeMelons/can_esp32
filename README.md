# CAN ESP32

## Summary

New cars do chimes when turning on the engine. My '06 Focus does not. This device aims to rectify that!
An ESP32 with an micro sd card reader, paired with a MAX9860 to play .wav files upon receiving certain CAN messages.
CAN connection handled by the TJA1050. Powered from the OBD2 port 12V rail, with two buck converters for 5V and 3V.

Is an AP that serves a Preact App for listening in on the CAN network via a websocket connection.

Avaialble through `obd2.local` with the help of mdns!

## TODO

- [FE] Pop over component. Set of actions on a button click.
- [FE] View message modal. Click say on X, we show only X messages.
- [FW] Send request? To possibly get RPM reporting.
- [FE] Send request modal - sends message via websocket, shows mathing messages.
- Plug in device to gather more data points - need to decipher the messages.

## Julie OBD2 emulator

RED: VCC
BLUE: GND
GREEN: CODE (UNCONNECTED/GND)
BLACK: CAN-H
WHITE: CAN-L

## SPIFFS

## Websocket

- Must enable WS in SDK
- Must increase HTTP URI Length in SDK

## TJA1050

TX & RX should be swapped when connecting - RX goes to TX, RX to TX as usual.

## SD Card

Files present on the SD card at `/`

- xp/oxp.wav
- xp/vistashutdown.wav

## VSC

Instal LLVM and use theclang-format extension for formatting. [link](https://github.com/llvm/llvm-project/releases/tag/llvmorg-20.1.0)

## IDF

ESP-IDF projects are built using CMake. The project build configuration is contained in `CMakeLists.txt`
files that provide set of directives and instructions describing the project's source files and targets
(executable, library, or both).

Below is short explanation of remaining files in the project folder.

```
├── CMakeLists.txt
├── main
│   ├── CMakeLists.txt
│   └── main.c
└── README.md                  This is the file you are currently reading
```

Additionally, the sample project contains Makefile and component.mk files, used for the legacy Make based build system.
They are not used or needed when building with CMake and idf.py.
