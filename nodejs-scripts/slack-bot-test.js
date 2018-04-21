"use strict";
const https = require('https');
const config = require('./config.js');
const slackApi = require('./slack-api.js');
var coffeeMsg = require('./messages.js');
// generic wrapper to make calls 
// https://api.slack.com/methods/

var slack = new slackApi(config.slackBot.token, false);



// slack.apiCall('channels.info',{channel:'C78JPFC84'},(response)=> {console.log(response); });

// slack.apiCall('reminders.add',{
// 	channel:config.slackBot.channelID,
// 	time: new Date().getTime()+ 1000*10,
// 	text : "This is reminder",
// 	user : 'U6ZBPEDM1'
// },(response)=> {console.log(response); });

// sends a reminder to buy coffee to a random person
// slack.apiCall('channels.info',{channel:'C78JPFC84'},(response)=> 
// {

// 	let channelMembersId = response.channel.members;
// 	slack.apiCall('users.list',{},(r)=>
// 	{
// 		let users = r.members;

// 		// console.log(users);
// 		let coffeeDrinkers = users.filter((user)=>{return channelMembersId.indexOf(user.id)>=0 && user.is_bot == false;});
// 		let randomGuy = coffeeDrinkers[Math.floor(Math.random()*coffeeDrinkers.length)];
		

// 		// coffeeDrinkers.map((a)=>{console.log(a.real_name)});
// 		// console.log("Coffee duty:", randomGuy.real_name);
// 		slack.apiCall('chat.postMessage',{channel:config.slackBot.channelID, text: coffeeMsg.reminder(randomGuy) });

// 	});

// });


// var a = new SlackAPI(config.slackBot.serlSwedenToken);

// This is how you send a message & mention someone
// 
slack.apiCall('chat.postMessage',{
	channel:config.slackBot.channelID, 
	parse: true,
	text: 'šāŗāŗāē kurkkuu Καλημέρα!  Hyvää huomenta! صبح بخير  صباح الخير' 

});


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











