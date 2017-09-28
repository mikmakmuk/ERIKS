/*

Shell command
adafruit-io client feeds watch erikscoffee --username unterk --key 1e18a1d34603480f96181e4956fa3846

*/
"use strict";

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://io.adafruit.com',{
	username: 'unterk', 
	password:'1e18a1d34603480f96181e4956fa3846',
	port: 1883 
})

client.on('connect', (response) => {
	console.log("Connected");
	client.subscribe('unterk/f/erikscoffee')
})


client.on('error', (error) => {
	console.log('MQTT Client Errored');
	console.log(error);
});



client.on('message', (topic, message) => {
	// displays:
	// message unterk/f/erikscoffee <Buffer 32 2e 39 37>
	console.log('message', topic, message.toString('utf8'));
})