# Security
## HTTPS
We use letsencrypt certificates on the server side (mosquitto, telegraf, influxdb, grafana). This means that the certificates renewed every 3 months. 
For the client (scale), we used therefore letsencrypt's IdenTrust [cross-signed certificate](https://letsencrypt.org/certificates/). To use it on the client we need to convert it as follows:
1. openssl x509 -outform der -in certificate.pem -out certificate.der
2. xxd --include certificate.der
3. The previous command creates the data structure that needs to be put into cacert.h

Since we use the root certificate on the client side, we don't need to renew anything.
On the server side, the IOT stack needs to be restarted once the certificate has been been renewed. This is done in the script that checks if its time to renew and does the renewal.

## Passwords
All server side passwords for the IOT stack can be found in the corresponding configuration files.

# Client firmware flashing
## Hardware setup
This is relevant for the bare esp12e chip. The nodemcu is already wired up correctly.
To locate the correct pins, look at the chip with the antenna facing you and up.

Setup for flashing using FTDI serial converter:
1. Connect power from flasher in battery socket
2. TX is the top right pin
3. RX is the second pin from top right
4. Remove the deep sleep jumper from pins top left (RST) and third down from top left (GPIO16)
5. Put a jumper on the fifth pin from top right (GPIO0) and the second pin from the bottom right (GND)
6. Attach the serial converter
7. Flash, remove the jumper from GPIO0, touch with it RST in order to reboot the chip, debug with serial console
8. In order to reflash, disconnect and reconnect (!) the serial converter from the USB port, and go to step 5.

## Building firmware and flashing
Build firmware:
pio run

Upload to nodemcuv2:
pio run -e nodemcuv2 -t upload

Upload to esp12e (platformio/arduino don't work with my boards)
esptool -p /dev/ttyUSB0 write_flash 0x00000 .pioenvs/esp12e/firmware.bin

Monitor:
pio device monitor -p /dev/ttyUSB0 -b 115200

## Useful commands
### Local
Test mosquitto:
mosquitto_pub -h lmsteiner.com -p 64365 -m "eriks kg=2.3,v=3.0" -t eriks/coffeescale --cafile /usr/share/ca-certificates/trust-source/mozilla.trust.p11-kit 

### Server side
#### Influxdb
Connect to database (check telegraf config for username and password):
influx -host localhost -port 61222 -ssl -unsafeSsl -username XXX -password YYY
