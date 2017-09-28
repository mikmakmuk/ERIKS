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
	
	
		// token: 'xoxb-247776202774-1Nd1W3XmUIA93PMPdSiyOmJT',
		// channel: 'coffeestatus',
		// clientID: '237692287926.246059117265',
		// clientSecret : '23079c021f65c018e2878283ad60917f',
		// verificationToken: 'PmSXhW2Mn2ykBj8ihyeOQJdb',
		// oauthToken: 'xoxp-237692287926-237397489715-246913517762-35ffbea62631e305367831662f421381',
		//	 'xoxp-237692287926-237397489715-246971793380-e4bb53a17bd6db9fd5595dcfdcd97683',
		// webHook: 'https://hooks.slack.com/services/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'
	}

};