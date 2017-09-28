"use strict";

const config = require('./config.js');
const slackApi = require('./slack-api.js');
const mqtt = require('mqtt');





function CoffeeGrunt(config)
{
	console.log('Starting grunt.. ')
	var slack = new slackApi(config.slackBot.token);
	var drawer = mqtt.connect(config.mqttServer.host,config.mqttServer);

	drawer.on('connect', (response) => 
	{
		console.log('Connected to mqtt..');
		drawer.subscribe('unterk/f/erikscoffee');
		drawer.subscribe('unterk/f/eriksbattery');
		slack.apiCall('chat.postMessage', {channel: config.slackBot.channelID,  text: "Coffee Grunt is here!!\nMonitoring caffeine and power levels.." });
	});


	


	var mqttErrorHandler = function(error)
	{
		console.log('MQTT Client Errored');
		console.log(error);
	};

	var mqttMessageHandler = function(topic, message)
	{
		// message unterk/f/erikscoffee <Buffer 32 2e 39 37>
		message = message.toString('utf8');
		console.log('message', topic, message);
		if (topic == 'unterk/f/erikscoffee')
		{
			//slack.apiCall('chat.postMessage', {channel: config.slackBot.channelID,  text: "Coffee levels are at "+parseFloat(message)+"kg" });
			handleCoffeeLevel(parseFloat(message));
		}
	};
	drawer.on('error', mqttErrorHandler);
	drawer.on('message', mqttMessageHandler);


	var handleCoffeeLevel = function(weight)
	{
		console.log('handleCoffeeLevel',weight , config.limits.coffee.warningLevel);
		if (weight < config.limits.coffee.warningLevel)
		{

			slack.apiCall('chat.postMessage', {channel: config.slackBot.channelID,  text: "Coffee levels are running low at "+weight+"kg\nAct now before it is too late!" });
		}
	};
}


new CoffeeGrunt(config);