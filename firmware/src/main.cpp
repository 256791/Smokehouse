#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

#include "constans.h"
#include "controller.h"

ESP8266WebServer server(80);

void statusRoute()
{
	String json = "{\"temperature\":";
	json += status.temperature;
	json += ",\"target\":";
	json += status.target;
	json += ",\"enable_heater\":";
	json += status.enable_heater ? "true" : "false";
	json += ",\"enable_smoker\":";
	json += status.enable_smoker ? "true" : "false";
	json += ",\"power\":";
	json += status.power*100/PID_INTERVAL;
	json += "}";

	server.send(200, "text/json", json);
}

void setRoute()
{
	if (server.arg("target") != "")
		status.target = server.arg("target").toInt();
	if (server.arg("enableheater") != "")
	{
		if (server.arg("enableheater") == "true"){
			status.enable_heater = true;
			status.lastPID = 0;
		}
		else if (server.arg("enableheater") == "false")
		{
			status.enable_heater = false;
			status.power = 0;
			digitalWrite(RELAY_HEATER, LOW);
		}
	}
	if (server.arg("enablesmoker") != "")
	{
		if (server.arg("enablesmoker") == "true")
			status.enable_smoker = true;
		else if (server.arg("enablesmoker") == "false")
			status.enable_smoker = false;
		digitalWrite(RELAY_SMOKER, status.enable_smoker ? 0x0 : 0x1);
	}
	server.send(200, "text/json", "message");
}

void homeRoute()
{
	server.send(200, F("text/html"),
				F("Smart Smokehouse"));
}

void notFoundRoute()
{
	String message = "File Not Found\n\n";
	message += "URI: ";
	message += server.uri();
	message += "\nMethod: ";
	message += (server.method() == HTTP_GET) ? "GET" : "POST";
	message += "\nArguments: ";
	message += server.args();
	message += "\n";
	for (uint8_t i = 0; i < server.args(); i++)
	{
		message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
	}
	server.send(404, "text/plain", message);
}

void setup(void)
{
	pinMode(LED_BUILTIN, OUTPUT);
	pinMode(RELAY_HEATER, OUTPUT);
	pinMode(RELAY_SMOKER, OUTPUT);

	digitalWrite(LED_BUILTIN, HIGH);
	digitalWrite(RELAY_HEATER, LOW);
	digitalWrite(RELAY_SMOKER, HIGH);

	WiFi.mode(WIFI_STA);
	WiFi.begin(SSID, PASSWORD);

	bool led = false;
	while (WiFi.status() != WL_CONNECTED)
	{
		led = !led;
		digitalWrite(LED_BUILTIN, led);
		delay(500);
	}
	digitalWrite(LED_BUILTIN, HIGH);

	MDNS.begin(M_DNS);
	// server.enableCORS(true);

	server.onNotFound(notFoundRoute);
	server.on("/", HTTP_GET, homeRoute);
	server.on(F("/status"), HTTP_GET, statusRoute);
	server.on(F("/set"), HTTP_GET, setRoute);

	server.begin();
}

void loop(void)
{
	server.handleClient();
	long long time = millis();
	handleMeasure(time);
	handlePID(time);
}