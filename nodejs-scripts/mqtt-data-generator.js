

/*

Shell command
adafruit-io client feeds watch erikscoffee --username unterk --key 1e18a1d34603480f96181e4956fa3846

*/
"use strict";
const config = require('./config.js');
var mqtt = require('mqtt')
var client = mqtt.connect(config.mqttServer.host, config.mqttServer);


client.on('connect', (response) => {
	console.log("Connected");



	var val = Math.random()*10;


	client.publish('unterk/f/erikstest', String(Math.round(val*100)/100 ));
	console.log('Msg sent');



	//client.subscribe('unterk/f/erikscoffee')
})


client.on('error', (error) => {
	console.log('MQTT Client Errored');
	console.log(error);
});



