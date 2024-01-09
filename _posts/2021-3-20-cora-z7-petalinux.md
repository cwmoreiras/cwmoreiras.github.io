---
layout: post
title: Embedded Linux with Cora Z7 (Part I)
description: Load Petalinux onto Cora Z7 with Vivado 2020.2 on Ubuntu 20.04
---

At work I develop for very resource-constrained systems. Typically I use a small microcontroller to interface with other devices through SPI, I2C and UART ports. However, some hobby projects I've been considering will use USB, Ethernet, and HDMI. Since I'm not worried about power consumption on these projects, and I don't really care to learn the ins and outs of those protocols just yet, I'm going to use Linux to keep the programming simple. 

Enter the [Cora Z7](https://store.digilentinc.com/cora-z7-zynq-7000-single-core-and-dual-core-options-for-arm-fpga-soc-development/) board from Digilent. This board features a Zynq-7000 SoC from Xilinx. I picked up the Dual-Core version, so I get 2 ARM Coretex-A9 cores (and the FPGA fabric) to play with. Of course, I pretty much impulse-bought this thing, so it wasn't until I opened the box that I realized there's no HDMI connector on there. Oops!

![Cora](https://i.imgur.com/FYGqMgO.jpg)

First order of business is to figure out how to load Linux onto the board. I'm looking at [this](https://github.com/Digilent/Petalinux-Cora-Z7-10/ "Petalinux Cora Z7-10")
project. Bad news is, it's built with Petalinux 2017.4. I am using the SDK version 2020.2 (yeah, *Digilent*, some of us like to keep our toolchain up to date). This is the error I get when I try to build the project from source:
```
$ petalinux-build 
WARNING: Your PetaLinux project was last modified by PetaLinux SDK version "2017.4",
WARNING: however, you are using PetaLinux SDK version "2020.2".
Please input "y" to continue. Otherwise it will exit![n]y
INFO: Sourcing build tools
[INFO] Building project
[INFO] Generating Kconfig for project
[INFO] Silentconfig project
ERROR: Failed to silentconfig project component 
ERROR: Failed to build project
```
Yikes! I'm not going to install an old version of Vivado just for this. That is a large piece of software, and I don't like starting a new project with an outdated toolchain. Thankfully, Digilent provides a board support package (BSP) that seems good to go. I'll figure out how to build Petalinux from source when I have to.

After I successfully put the boot files on the SD card and connected to the Cora Z7 through the serial port, I realized that I didn't have enough space on my SD card for a proper filesystem. I wanted my files to persist across reboots, so I went back a couple steps, reformatted the card, and put the boot files back on there.

Anyways, I used minicom to connect to the device, and it worked pretty easily to setup minicom with the command `minicom -s` using 8N1 @ 115200 baud and no flow control, as suggested in Digilent's README. The board was at `/dev/ttyUSB1`. Proof:
```
root@Cora-Z7-10:~# ls
root@Cora-Z7-10:~# uname -r
4.9.0-xilinx-v2017.4
```
Interesting.. So it's not just that the SDK was version 2017.4. Apparently, the kernel is going to be different depending on what SDK was used to build it. 

Unfortunately, this is where I ran into a problem. In order to configure the OS to use a filesystem on the second partition of my SD card, I have to run `petalinux-config` in my petalinux project directory. But again, since my SDK version is not the version that was used to build the kernel, the command fails:
```
WARNING: Your PetaLinux project was last modified by PetaLinux SDK version "2017.4",
WARNING: however, you are using PetaLinux SDK version "2020.2".
Please input "y" to continue. Otherwise it will exit![n]y
INFO: Sourcing build tools
[INFO] Generating Kconfig for project
[INFO] Menuconfig project
ERROR: Failed to menu config project component 
ERROR: Failed to config project.
```
Time to build the Petalinux project from scratch in Vivado, I guess. Honestly, I think I'm going to have to learn a little bit more about what is going on under the hood.

Sources:<br>
[1] [https://github.com/Digilent/Petalinux-Cora-Z7-10/](https://github.com/Digilent/Petalinux-Cora-Z7-10/)<br>
[2] [https://www.hackster.io/100311/estimating-pi-with-a-cora-z7-running-linux-03995b](https://www.hackster.io/100311/estimating-pi-with-a-cora-z7-running-linux-03995b)<br>
[3] [https://richarthurs.com/2019/01/05/cora-linux-getting-started/](https://richarthurs.com/2019/01/05/cora-linux-getting-started/)<br>
[4] [https://www.xilinx.com/products/design-tools/embedded-software/petalinux-sdk.html#tools](https://www.xilinx.com/products/design-tools/embedded-software/petalinux-sdk.html#tools)<br>
