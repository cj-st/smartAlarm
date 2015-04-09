var firebaseRef = new Firebase("https://smartalarmv2.firebaseio.com");
var alarmDataRef = firebaseRef.child("alarmdata");
var data; // native copy of firebase snapshot
var directionsService = new google.maps.DirectionsService();

function displayTime() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var date = currentTime.getDate();
    var monthNum = currentTime.getMonth();
    var locale = "en-us";
    var year = currentTime.getFullYear();

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if(seconds<10) seconds="0"+seconds;
	if(minutes<10) minutes="0"+minutes;
    if(hours<10) hours="0"+hours;
    var clockText = hours + ":" + minutes + ":" + seconds + "\n" + months[monthNum] + " "+date+" "+year;

    $("#time").text(clockText);
};

function renderAlarms() {
    for (var alarm in data.alarmdata) {
        var buttontext = '<span class="cancelbutton"><a href="#" class="ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-left cancelalarm" id="'+ alarm +'">Cancel Alarm</a></span>';
		var repeating = "";
		if (data.alarmdata[alarm].isRepeating == true) {
			console.log("rendering repeating alarm");
			repeating = "<strong>Repeat Alarm:  ";
			var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
			for (var i = 0; i < 7; i++) {
				if (data.alarmdata[alarm].repeats.indexOf(i) > -1) {
					repeating = repeating + days[i];
				}
			}
			repeating = repeating + "</strong>";
			$("#alarms").append('<li>"' +data.alarmdata[alarm].name +'" ' + repeating + ' ' + data.alarmdata[alarm].hour + ':' + data.alarmdata[alarm].minute + buttontext +'</li>');
		}
		else if (data.alarmdata[alarm].isSmart == true) {
			$("#alarms").append('<li>"'+data.alarmdata[alarm].name +'"<strong> Smart Alarm: </strong>'+data.alarmdata[alarm].year + '-' + data.alarmdata[alarm].month + '-' + data.alarmdata[alarm].day + ' ' + data.alarmdata[alarm].hour + ':' + data.alarmdata[alarm].minute + buttontext +'</li>');
		}
        else {
			$("#alarms").append('<li>"'+data.alarmdata[alarm].name + '" '+data.alarmdata[alarm].year + '-' + data.alarmdata[alarm].month + '-' + data.alarmdata[alarm].day + ' ' + data.alarmdata[alarm].hour + ':' + data.alarmdata[alarm].minute + buttontext +'</li>');
		}
	}
    $("#alarms").listview('refresh');
}

$(document).ready( function() {
    setInterval(function() {
        displayTime()
    }, 1000);
	getWeather();
});

firebaseRef.on('value', function(snapshot){
    data = snapshot.val();
    console.log("Firebase data changed!");
    $("#alarms").empty();
    renderAlarms();
});

// function for cancel alarms
$(document).on('click', '.cancelalarm', function(event){
	//console.log("alarm clicked");
    var id = $(this).attr('id');
	var text = data.alarmdata[id].year + '-' + data.alarmdata[id].month + '-' + data.alarmdata[id].day + ' ' + data.alarmdata[id].hour + ':' + data.alarmdata[id].minute;
    console.log("removed id: " + id);
	var childRef = alarmDataRef.child(id);
	childRef.remove();
});

function getWeather() {
	 var fullUrl="https://api.forecast.io/forecast/c041d01ad874a1877cd9917877f38154/49.2617,-123.2490";
        //get weather data from forecast.io
        $.ajax({
        url: fullUrl,
        dataType: "jsonp",
        success: function (data) {
            var icon=data.currently.icon;
            var temp=(data.currently.temperature-32)/1.8;
            var background = document.body;
            clockDiv = document.getElementById('clock');
            weatherDiv=document.getElementById('weather');
            weatherDiv=document.getElementById('weather');

            weatherDiv.innerText="Currently "+ icon +" " + Math.round(temp)+" C";
			var bgimage;
            switch(icon){
            case 'clear-day':
            case 'partly-cloudy-day':
                bgimage='url("images/sunny.jpg")';
                break;
            case 'cloudy':
                bgimage='url("images/cloudy.jpg")';
                clockDiv.style.color='white';
                weatherDiv.style.color='white';
                break;
            case 'rain':
                bgimage='url("images/rainyDay.jpg")';
                clockDiv.style.color='white';
                weatherDiv.style.color='white';
                break;
            case 'wind':
                bgimage='url("images/thunder.jpg")';
                clockDiv.style.color='white';
                weatherDiv.style.color='white';
                break;
            case 'snow':
            case 'sleet':
                bgimage='url("images/snowy.jpg")';
                break;
            case 'fog':
                bgimage='url("images/mist.jpg")';
                break;
            case 'clear-night':
            case 'partly-cloudy-night':
                bgimage='url("images/clearNight.jpg")';
                weatherDiv.style.color='white';
                clockDiv.style.color='white';
                break;
        }
		$("#clockPageContent").css("backgroundImage",bgimage);

        }
    });
}

function alarmSetNoRepeat() {
						var repeatToggle;
						if ($('#flip-1').slider().val() == "true") {
							repeatToggle = true;
						}
						else {
							repeatToggle = false;
						}
                        var nameSend = document.getElementById("namepicked").value;
                        console.log(nameSend);

//                        var dateSend = getDate();
//                        console.log(dateSend);
                        var dateInfo = document.getElementById("dateField").value;                 
                        var dayInfo = dateInfo.substring(0,2);
                        var monthInfo = dateInfo.substring(3,5);
                        var yearInfo = dateInfo.substring(6,10);
						
						
//                        var timeSend = getTime();
  //                      console.log(timeSend);
                        var timeSet = document.getElementById("timepicked").value;
                        var hourSet = timeSet.substring(0,2);
                        var minSet =  timeSet.substring(3,5);
						
                        var songSend = getAlarmSong();
                        //console.log(songSend);


                        var volumeSend = 100;
                        //console.log(volumeSend);

                        var daysRepSend = getRepeatedDays();
                        //console.log(daysRepSend);
                        
						// generate the object
						var obj = {
							name: nameSend,
							year: yearInfo,
							month: monthInfo,
							day: dayInfo,
							hour: hourSet,
							minute: minSet,
							repeats: daysRepSend,
							ringtone: songSend,
							volume: volumeSend,
							isSmart: false,
							isRepeating: repeatToggle
						}
						console.log(obj);
						alarmDataRef.push(obj, function() {
							var string = "Your alarm " + obj.name + " has been set for " + obj.hour + ":" + obj.minute + ".";
							$('#alarmconfirm').text(string);
							$(':mobile-pagecontainer').pagecontainer('change', '#listalarms', {
							});
							setTimeout(function() {
								$('#alarmSetConfirm').popup('open', {
            transition: 'pop'
        });
							},200);
						});
						
                        ClearFields();

                        }

                /*

                function alarmSetWithRepeat(){

                        var timeSend = getTime();
                        var songSend = getAlarmSong();
                        var volumeSend = getVolume();

                        //var daysRepSend = getRepeatedDays();
                        //console.log(daysRepSend);

                        ClearFields();                     
                }

                */

                function getRepeatedDays(){
                    var daysToRep = $( "#dayrep" ).val();
					if (daysToRep != null && daysToRep != undefined && daysToRep.length > 0) {
						return daysToRep.join();
					}
                    return "none";
                }

               /* function getVolume(){
                    var volumeSet = $("#slider-fill").val();
                    return volumeSet;
                }*/

                function getTime(){
                        var timeSet = document.getElementById("timepicked").value;
                        var hour = timeSet.substring(0,2);
                        var min =  timeSet.substring(3,5);

                        var value = [hour, min];
                        return value;
                }

                function getDate(){
                        var dateInfo = document.getElementById("dateField").value;                 
                        var day = dateInfo.substring(0,2);
                        var month = dateInfo.substring(3,5);
                        var year = dateInfo.substring(6,10);
               
                        var value = [year, month, day];
                        return value;
                }

                function getAlarmSong(){
                    var songInfo = document.getElementById("songfield");
                    var songVal = songInfo.options[songInfo.selectedIndex].value;
                    return songVal;

                }

                function ClearFields() {

                    document.getElementById("timepicked").value = "";
                    document.getElementById("namepicked").value = "";
                    document.getElementById("dateField").value = "";
					$("#dayrep").find('option:selected').removeAttr("selected");
					/*$("#songfield").val("21Guns.mp3");*/
					$('#dayrep').val('').selectmenu('refresh'); 
                }
				
				                function alarmTraffic(){

                    calcRoute();
                }

              function calcRoute() {
                  var startpos = document.getElementById('start').value;
                  var endpos = document.getElementById('end').value;
                
                  var request = {
                      origin:startpos,
                      destination:endpos,
                      travelMode: google.maps.TravelMode.DRIVING
                  };

                  directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
						var nameTraffic = document.getElementById('almnametraffic').value;
                        var durationSeconds = response.routes[0].legs[0].duration.value;
                        var durationSpeech = response.routes[0].legs[0].duration.text;

                        var arrivalTime = getArrivalTime();
                        var readyVal = document.getElementById("readytime").value;

                        var newTime = arrivalTime[0]*60*60 + arrivalTime[1]*60 - readyVal*60 - durationSeconds;
                        var newHours = Math.trunc(newTime/3600);
                        var newMinutes = Math.trunc((newTime - newHours*3600)/60);
						
						var trafficDateInfo = document.getElementById("trafficdate").value;                 
                        var dayTraffic = trafficDateInfo.substring(0,2);
                        var monthTraffic = trafficDateInfo.substring(3,5);
                        var yearTraffic = trafficDateInfo.substring(6,10);

                       // console.log(newTime);
						
                        console.log("New time: " + newHours + ":" +newMinutes);
                       // console.log(newMinutes);
						
						var songInfo = document.getElementById("songfield2");
						var songVal = songInfo.options[songInfo.selectedIndex].value;
						
						var durationMinutes = Math.round(durationSeconds/60);
						console.log("Duration minutes :" + durationMinutes);
						var infostring = "Your trip from " + startpos + " to " + endpos + " will take " + durationMinutes + " minutes to complete.";
						
						var obj = {
							origin: startpos,
							destination: endpos,
							name: nameTraffic,
							year: yearTraffic,
							month: monthTraffic,
							day: dayTraffic,
							hour: newHours,
							minute: newMinutes,
							repeats: "no",
							ringtone: songVal,
							isSmart: true,
							isRepeating: false,	// temporary!!!
							extraText: infostring,
						}
						console.log(obj);
						alarmDataRef.push(obj, function(){
							var string = "Your smart alarm " + obj.name + " has been set for " + obj.hour + ":" + obj.minute + ". Your trip from " + obj.origin + " to " + obj.destination + " will take " + durationMinutes + " minutes. This has been taken into account when setting the alarm.";
							$('#alarmconfirm').text(string);
							$(':mobile-pagecontainer').pagecontainer('change', '#listalarms', {
							});
							setTimeout(function() {
								$('#alarmSetConfirm').popup('open', {
            transition: 'pop'
        });
							},200);
						});
						
						
                        //var value = [newHours, newMinutes];                      
                        
                        clearTrafficAlarm();
                     }
                  });

                }

                function clearTrafficAlarm(){
					document.getElementById("almnametraffic").value = "";
                    document.getElementById("readytime").value ="";
                    document.getElementById("start").value ="";
                    document.getElementById("end").value ="";
                    document.getElementById("arrivaltime").value ="";
					document.getElementById("trafficdate").value ="";
                }

                  function getArrivalTime(){
                        var timeSet = document.getElementById("arrivaltime").value;
                        var hour = timeSet.substring(0,2);
                        var min =  timeSet.substring(3,5);
                        var value = [hour, min];
                        return value;
                }
    