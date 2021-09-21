def on_button_pressed_a():
    basic.show_number(Environment.octopus_BME280(Environment.BME280_state.BME280_TEMPERATURE_C))
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    basic.show_number(Environment.octopus_BME280(Environment.BME280_state.BME280_HUMIDITY))
input.on_button_pressed(Button.B, on_button_pressed_b)

ESP8266_IoT.init_wifi(SerialPin.P8, SerialPin.P12, BaudRate.BAUD_RATE115200)
ESP8266_IoT.connect_wifi("MOBILE.CSDPS", "2233avroyalequebec")
basic.pause(5000)

def on_forever():
    ESP8266_IoT.connect_thing_speak()
    ESP8266_IoT.set_data("QDTG6PAVV5Q3297D",
        Environment.octopus_BME280(Environment.BME280_state.BME280_TEMPERATURE_C),
        Environment.octopus_BME280(Environment.BME280_state.BME280_HUMIDITY),
        Environment.octopus_BME280(Environment.BME280_state.BME280_HUMIDITY) / 10,
        Environment.read_soil_humidity(AnalogPin.P2),
        Environment.read_light_intensity(AnalogPin.P1))
    ESP8266_IoT.upload_data()
basic.forever(on_forever)
