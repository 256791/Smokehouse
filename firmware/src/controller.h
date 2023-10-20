#include "max6675.h"
#include "constans.h"

MAX6675 thermocouple(MAX6675_CLK, MAX6675_CS, MAX6675_DO);

struct Status
{
    int target = 50;
    int temperature = 0;
    bool enable_heater = false;
    bool enable_smoker = false;
    int power = 0;

    long long lastMeasure = 0;
    long long lastPID = 0;
    bool checkPower = false;
};

Status status;

void handleMeasure(long long time)
{
    if (time - status.lastMeasure > MEASURE_INTERVAL)
    {
        status.lastMeasure = time;
        status.temperature = thermocouple.readCelsius();
    }
}

const float Kp = 0.1;
// add integral and derivative
void handlePID(long long time)
{
    if (status.enable_heater)
    {
        int elapsed = time - status.lastPID;

        if (elapsed > PID_INTERVAL)
        {
            float error = status.target - status.temperature;

            float p = Kp * error;

            status.power = p * PID_INTERVAL;
            if (status.power < RELAY_SWITCH_TIME)
                status.power = 0;
            if (status.power > PID_INTERVAL - RELAY_SWITCH_TIME)
                status.power = PID_INTERVAL;
            status.lastPID = time;

            if (status.power > 0)
            {
                digitalWrite(RELAY_HEATER, HIGH);
                status.checkPower = true;
            }else{
                digitalWrite(RELAY_HEATER, LOW);
            }
        }
        else if (status.checkPower && status.power < elapsed)
        {
            digitalWrite(RELAY_HEATER, LOW);
            status.checkPower = false;
        }
    }
}