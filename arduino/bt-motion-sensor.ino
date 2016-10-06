#include <SoftwareSerial.h>

// Define the pinout used on the Arduino
#define MOTION_SENSOR 4
#define BT_SERIAL_RX 10
#define BT_SERIAL_TX 11
#define LED_PIN 13

// The time between polls of the motion sensor
#define WAIT_PERIOD 100

// Set up the software UART to talk to the Bluetooth module
SoftwareSerial btSerial(BT_SERIAL_RX, BT_SERIAL_TX);

// Last motion event
bool lastMotionState = false;

void setup() {
    pinMode(LED_PIN, OUTPUT);
    btSerial.begin(9600);
}

void loop() {
    
    // Wait before checking again
    delay(WAIT_PERIOD);

    // Motion detected?
    if (digitalRead(MOTION_SENSOR) != lastMotionState) {
        lastMotionState = !lastMotionState;
        transmit();
    }
    
}

void transmit() {
    // Flash LED during transmit
    digitalWrite(LED_PIN, HIGH);
    
    // Notify the hub about a motion event
    String jsonString = String("{\"motion\":");
    jsonString += String(lastMotionState ? "1" : "0");
    jsonString += String("}");
    btSerial.println(jsonString);

    // LED off until next transmit
    digitalWrite(LED_PIN, LOW);
}
