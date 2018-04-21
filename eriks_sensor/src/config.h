//Wifi station name:
const char* SSID = "Eriks's Wi-Fi Network";

//Wifi Password:
const char* WIFI_PWD = "HomerSimpson";

const char* MQTT_SERVER = "data.lmsteiner.com";

const int   MQTT_PORT = 64365;

const char* MQTT_USER = "mik";

const char* MQTT_PWD = "p4s2QmnYLUgZbbd8";

//Feeds
const char* FEED = "eriks/coffeescale";

//Hardware configuration
const int   HX711_DATA = 14; //GPIO14 (D5) blue
const int   HX711_CLK = 13; //GPIO13 (D7) white
const int   RTC_MAGIC = 0x75a78fc5;
const int   BATT_FULL = 2812;
const int   BATT_CUTOFF = 2280;
const float SCALE_CALIBRATION = -99300; //manually adjust constant to match load cell reading to a known weight
  
//Timings
const int STARTUPDELAY = 60000; // 1 minute, used in delay()
const int SLEEPTIME = 60 * 60 * 1000000; // 60 minutes, used in deepSleep()

//Debugging options
const bool  SEND_DATA = true;
