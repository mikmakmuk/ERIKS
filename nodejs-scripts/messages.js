

// TODO: customize messages by hour, wording..

var getGreeting = function()
{	
	return 'Hello There!';
};

var getWarning = function ()
	{
		return 'Coffee levels running low!';
	};

var getScream = function()
{
	return "Coffee levels critical!\nIt may be end of the SERL as we know it..";
};

var getOk = function()
{
	return "Coffee levels seems to be in fine!\nHave a caffeinated day!";	
};

var amount = function(weight)
{
	return "We have "+weight+"kg of coffee beans left!";
};

var interval = function(weight)
{
	return "No coffee weight readings for a long time..\nIs it a hardware problem, a management problem, or an integration problem?";
};


module.exports.normalMessage = function(timestamp, value, limits)
{
	return [
		getGreeting(),
		amount(value),
		getOk()
	].join("\n");
};

module.exports.intervalMessage = function(timestamp, value, limits)
{
	return [
		getGreeting(),
		interval(limits)
	].join("\n");
};

module.exports.lowMessage = function(timestamp, value, limits)
{
	return [
		getGreeting(),
		getWarning(limits),
		getOk()
	].join("\n");
};
module.exports.criticalMessage = function(timestamp, value, limits)
{
	return [
		getGreeting(),
		getScream(value,limits),
		getOk()
	].join("\n");
};