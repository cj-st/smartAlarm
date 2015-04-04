var sys = require('sys');
var exec = require('child_process').exec;
var usonic = require('r-pi-usonic');
var sensor = usonic.createSensor(27, 17, 750);

exports.startSensing = function(offset){
setInterval(function() {
	var volume = "amixer cset numid=1 " + (Math.round(sensor())+offset) + "%";
//	console.log(volume);
	exec(volume, puts);
}, 200);
};

function puts(error, stdout, stderr) {  
//	console.log(stdout);
};
