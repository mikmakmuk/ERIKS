var fs = require('fs');
const readLastLines = require('read-last-lines');

class FileStorge
{
	constructor(config)
	{
		this.config = config;
	}


	escapeFileName(str) 
	{
  		return str.replace(/[//]/g, "_"); // replaces / with _
	}
	getFileName(stream, timestamp)
	{

		stream = this.escapeFileName(stream);
		var year = new Date(timestamp).getFullYear();
		return this.config.storagePath+stream+'_'+year+'.txt';
	}

	readLastEntries(stream, timestamp, num = 1,callback)
	{
		var fileName = this.getFileName(stream, timestamp);
		readLastLines.read(fileName, num).then(
		(data) => 
		{
			var buf = [];
			var lines = data.trim().split("\n");
			for(let i=0;i<lines.length;i++)
			{
				var f = lines[i].trim().split("\t");
				buf.push({timestamp: f[0], data: f[1] });
			};
			callback(buf);
		},(err)=>callback([]));

	}
	saveEntry(stream,timestamp ,data)
	{
		var fileName = this.getFileName(stream, timestamp);
		fs.appendFile(fileName,[timestamp,data,"\n"].join("\t"), (err)=> 
		{
		    if(err) 
		    {  
		    	return console.log(err); 
		    }
		}  );

	}
}

module.exports = FileStorge;