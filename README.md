# homebridge-bt-motion-sensor

This is the Homebridge accessory for my little Arduino based Bluetooth motion sensors.

The Arduino sketch for the motion sensors is included in the `arduino` directory within this repository.

## Installation

You'll need to use a Bluetooth frontend (like `bluetoothctl`) to pair your HC-06-_like_ devices, then use `rfcomm` to bind the devices to Bluetooth serial ports:

	rfcomm bind rfcomm0 00:11:22:33:44:55

Then configure Homebridge for each Bluetooth motion sensor you've set up in `~/.homebridge/config.json`:

	...
    "accessories": [
    ...
	    {
	        "accessory": "BluetoothMotionSensor",
	        "name": "Motion 1",
	        "port": "/dev/rfcomm0"
	    },
    ...
    ]
    ...

You should then be able to start Homebridge and the accessory should listen for motion updates from the remote devices.
