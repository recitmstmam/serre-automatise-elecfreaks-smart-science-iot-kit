input.onButtonPressed(Button.A, function () {
    basic.showNumber(Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C))
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(Environment.octopus_BME280(Environment.BME280_state.BME280_humidity))
})
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("MOBILE.CSDPS", "2233avroyalequebec")
basic.pause(5000)
basic.forever(function () {
    ESP8266_IoT.connectThingSpeak()
    ESP8266_IoT.setData(
    "QDTG6PAVV5Q3297D",
    Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C),
    Environment.octopus_BME280(Environment.BME280_state.BME280_humidity),
    Environment.octopus_BME280(Environment.BME280_state.BME280_humidity) / 10,
    Environment.ReadSoilHumidity(AnalogPin.P2),
    Environment.ReadLightIntensity(AnalogPin.P1)
    )
    ESP8266_IoT.uploadData()
})
