

// TODO: customize messages by hour, wording..


/**
 * Returns a random element from the array
 * @return {[type]} [description]
 */
Array.prototype.random = function()
{ 
	return this[ Math.floor(Math.random() * this.length) ]; 
};


var convert = function(amount)
{
	var labels = [ "atomic mass unit", "carat", "cental", "centigram", "dekagram", "dram", "grain", "gram", "hundredweight", "kilogram", "microgram", "milligram", "newton", "ounce", "pennyweight", "pound", "quarter", "stone", "ton", "ton", "tonne", "troy ounce"];
	var q = [ 6.022136651675E+26, 5000, 0.02204622621849, 100000, 100, 564.3833911933, 15432.35835294, 1000, 0.01968413055222, 1, 1000000000, 1000000, 9.80665, 35.27396194958, 643.0149313726, 2.204622621849, 0.07873652220889, 0.1574730444178, 0.0009842065276111, 0.001102311310924, 0.001, 32.15074656863  
	];
	return labels.map(function(e,i){ 

 let v = Math.round(amount*q[i] * 1000)/1000; let ending = v*100000000 % 2 ? '': 's' ;
 return v+" "+e+ending; 

	});

};

var getGreeting = function()
{	
	return [ 'Hello There!', 'Hi!', 'Hola!', 'Hej!', 'Labrīt!', 'Guten Morgen!', 'Καλημέρα!', 'Hyvää huomenta!', 'صبح بخير', 'صباح الخير'
 ].random();
};

var getWarning = function ()
	{ return [ 	'Coffee levels are running low!', 	'We are on our last coffee beans bag!',

 	].random();
	};

var getScream = function()
{
	return [ "Coffee levels are critical!\nIt may be end of the SERL as we know it..", "We are running out of coffee!" ].random();
};

var getOk = function()
{
	return [ "Coffee levels seems to be in fine!\nHave a caffeinated day!", "We have plenty of coffee for today!", "No reason to panic!" ].random();
};

var amount = function(weight)
{
	return [ "We have "+convert(weight).random()+" of coffee beans left!" 
 ].random();
};

var interval = function(weight)
{
	return "No coffee weight readings for a long time..\nIs it a hardware problem, a management problem, or an integration problem?";
};

module.exports.reminder = function(user)
{
	return [
		[ 
			"<@"+user.id+">, could you please go and buy some more coffee?", 
			"If you don't know how to do it, instructions are here:", 
			"https://serl.wikispaces.com/On%20buying%20SERL%20coffee"
		].join("\n"),

		[ 
			"It is <@"+user.id+"> turn to get more coffee!", 
			"If you don't remember how to do it, find instructions here:", 
			"https://serl.wikispaces.com/On%20buying%20SERL%20coffee"
		].join("\n")

	].random();

};


module.exports.normalMessage = function(timestamp, value, limits)
{
	return [ getGreeting(), amount(value), getOk()
	].join("\n");
};

module.exports.intervalMessage = function(timestamp, value, limits)
{
	return [ getGreeting(), interval(limits)
	].join("\n");
};

module.exports.lowMessage = function(timestamp, value, limits)
{
	return [ getGreeting(), getWarning(limits),
	].join("\n");
};
module.exports.criticalMessage = function(timestamp, value, limits)
{
	return [ getGreeting(), amount(value), getScream(value,limits),
	].join("\n");
};