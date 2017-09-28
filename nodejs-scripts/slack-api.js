"use strict";
const https = require('https');


// generic wrapper to make calls 
// https://api.slack.com/methods/
class SlackAPI
{

	/**
	 * c  true - dump messages to console instead of slack api. (for debugging purposes)
	 */
	constructor (token, useConsole)
	{
		this.token = token;
		this.useConsole = false;//useConsole || false;
	}
	
	nop(data){ };

	apiCall(funct, params, successCallback, errorCallback)
	{
		successCallback = successCallback || this.nop;
		errorCallback = errorCallback || this.nop;
		params = params || {};

		var paramsBuf = [];

		params.token = this.token;
		for(let p in params )
		{
			paramsBuf.push(p+'='+escape(params[p]));
		}


		if (this.useConsole)
		{
			console.log('Slack API Call: ', funct, params);
		}
		else
		{
			// console.log('https://slack.com/api/'+funct+'?'+paramsBuf.join('&')  );
			https.get('https://slack.com/api/'+funct+'?'+paramsBuf.join('&')  , (resp)=>
			{
				let data = '';
				resp.on('data', (chunk) => {data += chunk;});
				resp.on('end', () => 
				{
					// console.log(data);
					successCallback( JSON.parse(data)) 
				});
			})
			.on("error", (err) => 
			{
				// console.log("Error: ", err.message);
				errorCallback(err);  
			});
		}
		

	}
}

module.exports = SlackAPI;