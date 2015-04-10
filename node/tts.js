var fs = require('fs');
var lame = require('/usr/local/lib/node_modules/lame');
var Speaker = require('/usr/local/lib/node_modules/speaker');
var http = require('http');

exports.speak = function(text) {

//var url = "http://translate.google.com/translate_tts?tl=en&q=hello world";
var url = "http://translate.google.com/translate_tts?tl=en&q=" + text;
console.log("TTS Speaking: " + text);
http.get(url, function(res) {
	console.log("Response status: " + res.statusCode);
	res.pipe(new lame.Decoder)
	.on('format', console.log)
	.pipe(new Speaker);
}).on('error', function(e) {
	console.log("Got error: " + e.message);
});
};
