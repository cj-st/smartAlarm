var sys = require('sys');
var exec = require('child_process').exec;
var usonic = require('r-pi-usonic');
var sensor = usonic.createSensor(27, 17, 450);
var interval;

exports.startSensing = function(offset){
interval = setInterval(function() {
	var distance = sensor();
	var percent = Math.round(75 + distance/4);
//	console.log(percent);
	var volume = "amixer cset numid=1 " + percent + "%";
//	console.log(volume);
	if (distance < 60 && distance >= 0) {
//		console.log(percent);
		exec(volume, puts);
	}
	else if (distance > 60 && distance < 200) {
		exec("amixer cset numid=1 85%", puts);
	}
	else {
	// do nothing for now.
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
