# _Sample project_

(See the README.md file in the upper level 'examples' directory for more information about examples.)

This is the simplest buildable example. The example is used by command `idf.py create-project`
that copies the project to user specified path and set it's name. For more information follow the [docs page](https://docs.espressif.com/projects/esp-idf/en/latest/api-guides/build-system.html#start-a-new-project)

## Julie OBD2 emulator

  RED:    VCC
 BLUE:    GND
GREEN:    CODE (UNCONNECTED/GND)
BLACK:    CAN-H
WHITE:    CAN-L

## SPIFFS

## Websocket

- Must enable WS in SDK
- Must increase HTTP URI Length in SDK

## TJA1050

TX & RX should be swapped when connecting - RX goes to TX, RX to TX as usual.

## SD Card

Files present on the SD card at `/`

- a_file.txt
- 005 - Toto - Africa.wav
- 005 - Toto - Africa.mp3
- xp/oxp.wav
- xp/vistashutdown.wav
- xp/winxp.mp3
- xp/winxpshutdown.mp3

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
