#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <HX711.h>
#include <math.h>
#include <time.h>
#include "config.h"
#include "cacert.h"

// Include API-Headers
extern "C" {
#include "user_interface.h" //***********
}

extern const unsigned char CAcert[];
extern const unsigned int CAcert_len;

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

ADC_MODE(ADC_VCC);//Set the ADCC to read supply voltage.

void setup_https(WiFiClientSecure* wclient) {
  // Synchronize time useing SNTP. This is necessary to verify that
  // the TLS certificates offered by the server are currently valid.
  Serial.print("Setting time using SNTP");

  configTime(8 * 3600, 0, "pool.ntp.org", "time.nist.gov");
  time_t now = time(nullptr);
  while (now < 1000) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println("");
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.print("Current time: ");
  Serial.print(asctime(&timeinfo));

  // Load root certificate in DER format into WiFiClientSecure object
  bool res = wclient->setCACert(CAcert, CAcert_len);
  if (!res) {
    Serial.println("Failed to load root CA certificate!");
    while (true) {
      yield();
    }
  }
}

//All of the code is in setup, because there is no looping - only deep sleep between cycles
void setup() {
  float weight, last_weight, battery_level;
  int wifi_keeptrying;

  RTC RTCvar;
  HX711 scale(HX711_DATA, HX711_CLK, 128);
  WiFiClientSecure wclient;
  PubSubClient mclient(wclient);

  // Setup console
  Serial.begin(115200);
  Serial.println("Booting");

  mclient = mclient.setServer(MQTT_SERVER, MQTT_PORT);

  SETUP_DONE:

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

    setup_https(&wclient);

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

  //only update if weight has changed by more than 50g
  //if(abs(weight - last_weight) >= 0.05) {
  if(true) { //Always send data, independently from previous measurment
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

      if(SEND_DATA && mclient.connect("eriks_sensor", MQTT_USER, MQTT_PWD)) {
	char msg[50];
	snprintf(msg, 50, "eriks kg=%.2f,v=%.2f", weight, battery_level);
	Serial.println(msg);
	mclient.publish(FEED, msg);
	mclient.disconnect();
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
  //delay(5000);

  //goto SETUP_DONE;
}

void loop() {

}

