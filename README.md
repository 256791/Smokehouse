# Smokehouse Controller

This project is an ESP 12E-based smokehouse controller with a React Native app. It utilizes the MAX6675 thermocouple board for temperature readings, a solid-state relay for heater control, and a relay for the smoke generator. The ESP connects to a nearby network specified in the configuration and exposes an interface for the app to communicate with. With the app, you can set the temperature, check the current temperature, and toggle the smoke generator.

## Future works

Currently controller works 'well enough', but there is a lot of room for improvement. In the future, I plan to:

* Change communication to websockets.
* Add WiFi bootup configuration.
* Implement phase angle control.
* Implement PID control for temperature regulation.
* Add a display and keypad interface.
* Design a proper PCB.