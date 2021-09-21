input.onButtonPressed(Button.B, function () {
    basic.showString("H sol = " + Humidité_sol + " %")
    basic.pause(1000)
    basic.showString("Temp = " + Température + " °C")
    basic.pause(1000)
    basic.showString("Pression = " + Environment.octopus_BME280(Environment.BME280_state.BME280_pressure) / 10 + " kPa")
    basic.pause(1000)
    basic.showString("H air = " + Environment.octopus_BME280(Environment.BME280_state.BME280_humidity) + " %")
    basic.pause(1000)
    basic.showString("Luminosité = " + Environment.ReadLightIntensity(AnalogPin.P3) + " %")
    basic.pause(1000)
})
let range2: neopixel.Strip = null
let range: neopixel.Strip = null
let Température = 0
let Humidité_sol = 0
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("MOBILE.CSDPS", "2233avroyalequebec")
basic.pause(5000)
let Angle_fenêtre_fermée = 90
let Angle_fenêtre_ouverte = 150
let strip = neopixel.create(DigitalPin.P13, 40, NeoPixelMode.RGB)
Humidité_sol = Environment.ReadSoilHumidity(AnalogPin.P4)
Température = Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C) + 0
strip.showColor(neopixel.colors(NeoPixelColors.Black))
servos.P1.setAngle(Angle_fenêtre_fermée)
servos.P2.setAngle(10)
basic.pause(2000)
servos.P1.stop()
servos.P2.stop()
basic.forever(function () {
    if (Humidité_sol < 90) {
        servos.P2.setAngle(160)
    } else if (Humidité_sol >= 90 && Humidité_sol <= 97) {
        servos.P2.stop()
    } else if (Humidité_sol > 97) {
        servos.P2.setAngle(10)
    }
    servos.P2.stop()
    basic.pause(60000)
})
basic.forever(function () {
    if (Température >= 25) {
        while (Angle_fenêtre_fermée <= Angle_fenêtre_ouverte) {
            Angle_fenêtre_fermée += 1
            servos.P1.setAngle(Angle_fenêtre_fermée)
            basic.pause(10)
        }
        servos.P1.stop()
    } else {
        while (Angle_fenêtre_ouverte >= Angle_fenêtre_fermée) {
            Angle_fenêtre_ouverte += -1
            servos.P1.setAngle(Angle_fenêtre_ouverte)
            basic.pause(10)
        }
        servos.P1.stop()
    }
    basic.pause(60000)
})
basic.forever(function () {
    strip.setBrightness(255)
    if (Environment.ReadLightIntensity(AnalogPin.P3) < 50) {
        range = strip.range(0, 20)
        range2 = strip.range(20, 20)
        range.showColor(neopixel.colors(NeoPixelColors.Blue))
        range2.showColor(neopixel.colors(NeoPixelColors.Red))
    } else {
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    }
})
basic.forever(function () {
    ESP8266_IoT.connectThingSpeak()
    ESP8266_IoT.setData(
    "QDTG6PAVV5Q3297D",
    Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C),
    Environment.octopus_BME280(Environment.BME280_state.BME280_humidity),
    Environment.octopus_BME280(Environment.BME280_state.BME280_pressure) / 10,
    Environment.ReadSoilHumidity(AnalogPin.P4),
    Environment.ReadLightIntensity(AnalogPin.P3)
    )
    ESP8266_IoT.uploadData()
})
