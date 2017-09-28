"use strict";
const https = require('https');
const config = require('./config.js');

// generic wrapper to make calls 
// https://api.slack.com/methods/
class SlackAPI
{

	constructor (token)
	{
		this.token = token;
		this.pretty = 0;
	}
	
	nop(data){ };

	apiCall(funct, params, successCallback, errorCallback)
	{
		successCallback = successCallback || this.nop;
		errorCallback = errorCallback || this.nop;
		params = params || {};

		var paramsBuf = [];

		params.token = this.token;
		params.pretty = this.pretty;
		for(let p in params )
		{
			paramsBuf.push(p+'='+params[p]);
		}

		https.get('https://slack.com/api/'+funct+'?'+paramsBuf.join('&')  , (resp)=>
		{
			let data = '';
			resp.on('data', (chunk) => {data += chunk;});
			resp.on('end', () => {successCallback(JSON.parse(data)) });
		})
		.on("error", (err) => {console.log("Error: " + err.message);errorCallback(JSON.parse(err));  });

	}




	// this.usersList = function(callback)
	// {
	// 	this.apiCall('users.list', (data)=>{callback(data);}, (err)=>{});
	// };


	// this.apiCall = function(channelID, text)
	// {
	// 	this.request('chat.postMessage', (data)=>{callback(data);}, (err)=>{});	
	// }


}

module.exports = SlackAPI;
// var a = new SlackAPI(config.slackBot.serlSwedenToken);

// This is how you send a message & mention someone
// 
//a.apiCall('chat.postMessage',{channel:'C78JPFC84', text: 'testing <@eriksklotins>'  });


// This is how you get channel info & members of the channel
// a.apiCall('channels.info',{channel:'C78JPFC84'},(r)=> {console.log(r);});
// 
// 
// 
// a.apiCall('channels.info',{channel:'C78JPFC84'},(r)=>{
// 	console.log(r.channel.members);
// a.apiCall('chat.postMessage',{channel:'C78JPFC84', text: 'Greetings '+r.channel.members.map((u)=>{return '<@'+u+'>,'} )+'!'  });
// });

// This is how you get a list of all users
// 
// a.apiCall('users.list',{},(r)=>{console.log(r);});











