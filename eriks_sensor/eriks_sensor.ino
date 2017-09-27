#include <ESP8266WiFi.h> 
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <Wire.h>
#include <HX711.h>
#include <math.h>
#include <Adafruit_MQTT.h>
#include <Adafruit_MQTT_Client.h>
#include "Config.h"


// Include API-Headers
extern "C" {
#include "user_interface.h" //***********
}

#define DEBUG false
//Comment out the following line to allow debugging info on serial monitor
//#define Serial if(DEBUG)Serial

//RTC memory structure
typedef struct {
  uint32 magic;
  uint64 calibration;
  float weight;
  boolean battwarningsent;
  boolean weightwarningsent;
} RTC;

HX711 scale(HX711_DATA, HX711_CLK, 128);
ADC_MODE(ADC_VCC);//Set the ADCC to read supply voltage.

RTC RTCvar;
WiFiClient wclient;
Adafruit_MQTT_Client mqtt(&wclient, MQTT_SERVER, MQTT_PORT, MQTT_USER, MQTT_PWD);

//All of the code is in setup, because there is no looping - only deep sleep between cycles
void setup() {
  float weight, last_weight, battery_level;
  int wifi_keeptrying;
  
  // Setup console
  Serial.begin(115200);
  Serial.println("Booting");

  //SETUP_DONE:

  //Read saved parameters
  system_rtc_mem_read(64, &RTCvar, sizeof(RTCvar));

  scale.power_up();

  //Calibrate scale (manually adjust constant to match load cell to known weight)
  scale.set_scale(SCALE_CALIBRATION); 

  //First time initialisation (after replacing battery and/or discharging caps to clear RTC memory)
  if(RTCvar.magic != RTC_MAGIC) {
    //Setup Scale
    scale.read();
    yield();
    scale.tare();               // reset the scale to 0 (with nothing on it)
    yield();
    last_weight = 0;
    
    RTCvar.magic = RTC_MAGIC;
    RTCvar.calibration = scale.get_offset();
    WiFi.mode(WIFI_STA);
    WiFi.begin(SSID, WIFI_PWD);

    //Wi-Fi must be present on initialisation start up as a failure probably indicates incorrect credentials
    //In that case we do not want to go into deep sleep
    while (WiFi.waitForConnectResult() != WL_CONNECTED) {
      Serial.println("Connection Failed! Rebooting...");
      Serial.print(".");
      delay(20000);
      ESP.restart();
    }
    
    Serial.println("");
    Serial.println("");
    Serial.print("Connected to ");
    Serial.println(SSID);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.println("");   
    Serial.println("rtc memory init...");

    Serial.print("Startup delay to setup the scale...");
    delay(STARTUPDELAY);
    Serial.print("Continuing...");
  }
  
  // If waking up from deep sleep, lookup saved values
  else {
    scale.set_offset(RTCvar.calibration);
    last_weight = RTCvar.weight;
  }

  //Get the average of 5 readings
  weight = scale.get_units(5);
  if (weight < 0) {
    weight = 0;
  }

  Serial.print("Weight: ");
  Serial.print(weight, 3);
  Serial.println(" kg");
  Serial.print("Last Weight: ");
  Serial.print(last_weight, 3);
  Serial.println(" kg");

  //Read supply voltage
  battery_level= ESP.getVcc() / 1000.0;

  //reset battery warning if not low (allowing for hysteresis)
  //if (battlevel > BATT_CUTOFF + 50) {
  //  battwarningsent = false;
  //}
    
  //reset weight warning if not low (allowing for hysteresis)
  //if (weight > containerAlertWeight + containerEmptyWeight + 50) {
  //  weightwarningsent = false;
  // }
    
  //only update if weight has changed by more than 50g
  if(abs(weight - last_weight) >= 0.05) {
    //reconnect wifi
    if(WiFi.status() != WL_CONNECTED) {
      Serial.print("Starting Wifi");
      WiFi.mode(WIFI_STA);
      WiFi.begin(SSID, WIFI_PWD);
    }

    wifi_keeptrying = 30;
    while((WiFi.status() != WL_CONNECTED) && wifi_keeptrying-- > 0) {
      Serial.print(".");
      delay(1000);
    }
    
    if(WiFi.status() == WL_CONNECTED) {
      Serial.println("Wifi started");
      
      //Reconnect to MQTT broker
      MQTT_connect();
      Serial.println("Sending MQTT updates"); 

      if(SEND_DATA) {
        Adafruit_MQTT_Publish coffee = Adafruit_MQTT_Publish(&mqtt, FEED_COFFEE);
        if(!coffee.publish(weight)) {
          Serial.println(F("Failed to send weight."));
        } else {
          Serial.println(F("Weight sent!"));
        }

        Adafruit_MQTT_Publish battery = Adafruit_MQTT_Publish(&mqtt, FEED_BATTERY);
        if(!battery.publish(battery_level)) {
          Serial.println(F("Failed to send battery level."));
        } else {
          Serial.println(F("Battery level sent!"));
        }
      }

      last_weight = weight;
    }
  }
    
  RTCvar.weight = last_weight;
  system_rtc_mem_write(64, &RTCvar, sizeof(RTCvar));
  delay(1);

  Serial.println("Going to sleep...");

  scale.power_down();
  
  ESP.deepSleep(SLEEPTIME, WAKE_RF_DEFAULT);
  delay(500);

  //goto SETUP_DONE;
}


void MQTT_connect() {
  int8_t ret;

  // Stop if already connected.
  if(mqtt.connected()) {
    return;
  }

  Serial.print("Connecting to MQTT... ");

  uint8_t retries = 3;
  while((ret = mqtt.connect()) != 0) { // connect will return 0 for connected
    Serial.println(mqtt.connectErrorString(ret));
    Serial.println("Retrying MQTT connection in 5 seconds...");
    mqtt.disconnect();
    delay(5000);  // wait 5 seconds
    retries--;
    if (retries == 0) {
      // basically die and wait for WDT to reset me
      while (1);
    }
  }
  Serial.println("MQTT Connected!");
}

void loop() {
}

