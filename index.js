var http = require('http');
var SerialPort = require('serialport');
var Accessory, Service, Characteristic, UUIDGen;

// Register our accessory with Homebridge
module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-bt-motion-sensor", "BluetoothMotionSensor", BluetoothMotionSensor, true);
}

function BluetoothMotionSensor(log, config) {
  var acc = this;
  this.log = log;
  this.name = config["name"];
  this.device = config["device"];

  // Configure the service
  this.service = new Service.MotionSensor(this.name);

  // Set up the serial port using the one specified in ~/.homebridge/config.json
  this.port = new SerialPort(config["port"], {
    parser: SerialPort.parsers.readline('\n')
  });

  // If the port is ever closed, try to reopen it
  setInterval((function () {
	if (!this.port.readable) {
	  acc.log('serial port is closed, reopening...');
	  this.port.open();
	}
  }).bind(this), 1000);

  // When the port receives data, check if the content is a motion event
  this.port.on('data', (function (data) {
    try {
      var json = JSON.parse(data);
      if (json.hasOwnProperty('motion')) {
        acc.log('received motion state change event: ', json.motion);
        this.service.getCharacteristic(Characteristic.MotionDetected).setValue(Boolean(json.motion));
      }
    } catch (e) {
      acc.log('Received invalid JSON from motion sensor: ', json);
    }
  }).bind(this));
}

// Provide the available services this accessory implements
BluetoothMotionSensor.prototype.getServices = function() {
  return [this.service];
}

