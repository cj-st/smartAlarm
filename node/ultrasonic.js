var sys = require('sys');
var exec = require('child_process').exec;
var usonic = require('r-pi-usonic');
var sensor = usonic.createSensor(27, 17, 450);
var interval;

exports.startSensing = function(offset){
interval = setInterval(function() {
	var distance = Math.round(sensor());
	var percent = Math.round(70 + sensor()/4);
	var volume = "amixer cset numid=1 " + percent + "%";
//	console.log(volume);
	if (distance < 60 && distance >= 0) {
		exec(volume, puts);
	}
	else if ((distance > 60 && distance < 100) || distance > 150) {
		// do nothing
	}
	else {
		exec("amixer cset numid=1 85%", puts);
	}
}, 200);
};

function puts(error, stdout, stderr) {  
//	console.log(stdout);
};

exports.stopSensing = function() {
	clearInterval(interval);
}

exports.setVolume = function(volume) {
	var command = "amixer cset numid=1 " + volume + "%";
	exec(command, puts);
}
