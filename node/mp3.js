var fs = require('fs');
var lame = require('/usr/local/lib/node_modules/lame');
var Speaker = require('/usr/local/lib/node_modules/speaker');

var stream;

exports.play = function(songfile) {
stream = fs.createReadStream(songfile)
  .pipe(new lame.Decoder)
  .on('format', console.log)
  .pipe(new Speaker);
}

exports.stop = function() {
	if(stream != undefined){
		stream.end();
	}
}
