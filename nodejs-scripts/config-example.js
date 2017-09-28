module.exports = 
{
	
	/*
	Where to store log files for readings
	Must be writable by node process
	 */	
	storagePath: 'Absolute/path/where/data/files/are/stored',


	/*
	Thresholds for issuing warnings
	low > critical
	 */
	coffeeLevels :
	{
		low : 		1, 		//	1kg - issues a warning
		critical : 	0.5,	//	0.5kg - starts panicking
		/*
		 Maximum time since last reading (ms). 
		 If this is exceeded, a a warning is dispatched
		 Use this to monitor the scale & other scripts
		 */
		interval : 24*60*60*1000 // 24h 
	},
	/*
	MQTT broker access settings
	 */
	mqttServer : 
	{
		host : 		'mqtt://io.adafruit.com',
		username : 	'xxxxxxx', 
		password : 	'xxxxxxx',
		port : 		1883 
	},
	/*
	Specifies channels to listen
	 */
	channels:
	[
		'xxxxxxx',
		'xxxxxxx',
		'xxxxxxx'
	],
	/*
	Slack API settings
	 */
	
	slackBot:
	{
		channelID : 'xxxxx',
		token : 	'xxxxxxxxx'	// Access token 
	}

};