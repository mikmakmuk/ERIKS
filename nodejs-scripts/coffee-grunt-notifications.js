/*
	** Features **
	

	1. Every 24 hours check coffee readings
		-	report status to slack
		-	if below warn level, send out a warning to email & slack


 */

const config = require('./config.js');
const slackApi = require('./slack-api.js');
var storage = require('./file-storage.js');
var coffeeMsg = require('./messages.js');

var slack = new slackApi(config.slackBot.token, false);
var store = new storage(config);	
// var msg = new messages;
// 
function checkReadings(channel,slackChannel, limits, msg)
{
	store.readLastEntries(channel,new Date().getTime(),1,(reading)=>{


	if (reading.length > 0)
	{	

		let value = parseFloat(reading[0].data);
		let timestamp = parseInt(reading[0].timestamp);
		/*
			Checking differnet things
		 */
		if (new Date().getTime() - timestamp > limits.interval)
		{
			// console.log('No weight readings for more than 24h');
			slack.apiCall('chat.postMessage',{channel:slackChannel, as_user:1,  text: 
				msg.intervalMessage(new Date().getTime(), value, limits)
			});
			return;
		}
		if (value > limits.low)
		{
			// console.log('Coffee level normal');
			slack.apiCall('chat.postMessage',{channel:slackChannel, as_user:1,  text: 
				msg.normalMessage(new Date().getTime(), value, limits)
			});
			return;
		}

		if (value <= limits.low && value > limits.critical)
		{
			//console.log('Coffee level low but not yet critical');
			slack.apiCall('chat.postMessage',{channel:slackChannel, as_user:1,  text: 
				msg.lowMessage(new Date().getTime(), value, limits)
				notifyRandomGuy(slackChannel)
			});
			
			return;
		}

		if (value <= limits.critical)
		{
			// console.log('Coffee level critical');
			slack.apiCall('chat.postMessage',{channel:slackChannel, as_user:1, text: 
				msg.criticalMessage(new Date().getTime(), value, limits)
			});
			return;
		}

	}
	});
}


// TODO: save the state somewhere, notify the same user again if readings are not back 
// to normal after 24h
function notifyRandomGuy(channel)
{

	slack.apiCall('channels.info',{channel:channel},(response)=> 
	{

		let channelMembersId = response.channel.members;
		slack.apiCall('users.list',{},(r)=>
		{
			let users = r.members;

			// console.log(users);
			let coffeeDrinkers = users.filter((user)=>{return channelMembersId.indexOf(user.id)>=0 && user.is_bot == false;});
			let randomGuy = coffeeDrinkers[Math.floor(Math.random()*coffeeDrinkers.length)];
			

			// coffeeDrinkers.map((a)=>{console.log(a.real_name)});
			// console.log("Coffee duty:", randomGuy.real_name);
			slack.apiCall('chat.postMessage',{channel:channel, text: coffeeMsg.reminder(randomGuy) });

		});

	});
}
checkReadings('unterk/f/erikscoffee',config.slackBot.channelID, config.coffeeLevels, coffeeMsg );
//setInterval(,1000);
	
