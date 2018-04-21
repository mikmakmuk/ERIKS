/*
	This is a dumb script that records readings from the 
	sensors and dumps everything in a storage

	all configuration for this is set on config.js
 */
"use strict";

const 	config = require('./config.js');
var 	mqtt = require('mqtt'),
		storage = require('./file-storage.js'),
		store = new storage(config),
		client = mqtt.connect(config.mqttServer.host, config.mqttServer);



client.on('connect', (response) => {
	console.log("Connected..");
	for(let c in config.channels)
	{
		client.subscribe(config.channels[c]);
		console.log('Subscribed to ', config.channels[c]);
	}
	// client.subscribe('unterk/f/erikscoffee');	
});


client.on('error', (error) => {
	console.log('MQTT Client Errored');
	console.log(error);
});

client.on('message', (topic, buffer) => 
{
	let message = buffer.toString('utf8');
	store.saveEntry(topic, new Date().getTime(), message);
	console.log([topic, new Date().getTime(), message].join("\t"));
});
