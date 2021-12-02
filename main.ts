input.onButtonPressed(Button.B, function () {
    basic.showString("H sol = " + Environment.ReadSoilHumidity(AnalogPin.P4) + " %")
    basic.pause(1000)
    basic.showString("Temp = " + Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C) + " °C")
    basic.pause(1000)
    basic.showString("Pression = " + Environment.octopus_BME280(Environment.BME280_state.BME280_pressure) / 10 + " kPa")
    basic.pause(1000)
    basic.showString("H air = " + Environment.octopus_BME280(Environment.BME280_state.BME280_humidity) + " %")
    basic.pause(1000)
    basic.showString("Luminosité = " + Environment.ReadLightIntensity(AnalogPin.P1) + " %")
    basic.pause(1000)
})
let range2: neopixel.Strip = null
let range: neopixel.Strip = null
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("MOBILE.CSDPS", "2233avroyalequebec")
basic.pause(1000)
let Angle_fenêtre = 170
let strip = neopixel.create(DigitalPin.P13, 40, NeoPixelMode.RGB)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
pins.servoWritePin(AnalogPin.P3, Angle_fenêtre)
pins.servoWritePin(AnalogPin.P2, 0)
basic.pause(2000)
pins.digitalWritePin(DigitalPin.P3, 0)
pins.digitalWritePin(DigitalPin.P2, 0)
basic.forever(function () {
    if (Environment.ReadSoilHumidity(AnalogPin.P4) < 78) {
        pins.servoWritePin(AnalogPin.P2, 160)
    } else if (Environment.ReadSoilHumidity(AnalogPin.P4) >= 78.1 && Environment.ReadSoilHumidity(AnalogPin.P4) <= 78.9) {
        pins.digitalWritePin(DigitalPin.P2, 0)
    } else if (Environment.ReadSoilHumidity(AnalogPin.P4) > 79) {
        pins.servoWritePin(AnalogPin.P2, 0)
    }
    basic.pause(2000)
    pins.digitalWritePin(DigitalPin.P2, 0)
    basic.pause(60000)
})
basic.forever(function () {
    if (Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C) >= 24) {
        while (Angle_fenêtre > 35) {
            Angle_fenêtre += -1
            pins.servoWritePin(AnalogPin.P3, Angle_fenêtre)
            basic.pause(10)
        }
        basic.pause(1000)
        pins.digitalWritePin(DigitalPin.P3, 0)
    } else {
        while (Angle_fenêtre < 170) {
            Angle_fenêtre += 1
            pins.servoWritePin(AnalogPin.P3, Angle_fenêtre)
            basic.pause(10)
        }
        basic.pause(1000)
        pins.digitalWritePin(DigitalPin.P3, 0)
    }
    basic.pause(60000)
})
basic.forever(function () {
    if (Environment.ReadLightIntensity(AnalogPin.P1) <= 40) {
        range = strip.range(0, 20)
        range2 = strip.range(20, 20)
        range.showColor(neopixel.colors(NeoPixelColors.White))
        range2.showColor(neopixel.colors(NeoPixelColors.White))
    } else {
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    }
    basic.pause(60000)
})
basic.forever(function () {
    ESP8266_IoT.connectThingSpeak()
    ESP8266_IoT.setData(
    "QDTG6PAVV5Q3297D",
    Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C),
    Environment.octopus_BME280(Environment.BME280_state.BME280_humidity),
    Environment.octopus_BME280(Environment.BME280_state.BME280_pressure) / 10,
    Environment.ReadSoilHumidity(AnalogPin.P4),
    Environment.ReadLightIntensity(AnalogPin.P1)
    )
    ESP8266_IoT.uploadData()
})
