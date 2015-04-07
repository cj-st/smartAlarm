//every page load
$(document).ready( function() {
    var clockDiv;
    var currentMode=0;
    var modeArr;
    var alarmCount=0;
    var number=0;
    var storeId=[];
    var address1;
    var address2;
    var count=0;
    //display time on webpage(bug: am pm has some issues)
    function displayTime() {
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();
        var date = currentTime.getDate();
        var monthNum = currentTime.getMonth()+1;
        var locale = "en-us";
        var month = currentTime.toLocaleString(locale, { month: "short" });
        var year = currentTime.getFullYear();
        var meridiem = "AM";
        if(hours>=12){
            if(hours==12){
                meridiem="PM";
            }else{
                hours-=12;
                meridiem = "PM";
            }
        }else if(hours===0){
                hours=12;
        }else{
            meridiem="AM";
        }


        //make it to two digits for 1-9
        if(monthNum<10) monthNum="0"+monthNum;
        if(date<10) date="0"+date;
        if(seconds<10) seconds="0"+seconds;
        if(minutes<10) minutes="0"+minutes;
        if(hours<10) hours="0"+hours;

        //get handler to clock div in html
        clockDiv = document.getElementById('clock');
        //set text inside clock div
        clockDiv.innerText = hours + ":" + minutes + ":" + seconds+
         " "+ meridiem +"\n" + month+" "+date+" "+year;

        //turn off listener when done
        messagesRef.on('value',function(snapshot){
            for(var id in snapshot.val()){
                if((snapshot.val()[id].date.indexOf(year+'-'+ monthNum +'-'+date)!=-1) && snapshot.val()[id].hour==hours && snapshot.val()[id].minute==minutes &&seconds=="00"){
                   //  var aud =document.createElement("audio");
                   //  aud.setAttribute("id","aud" +snapshot.val()[id].id);
                   //  console.log(aud.id);
                   //  aud.setAttribute("src","alarm.mp3");
                   //  document.getElementById("myAudio").appendChild(aud);
                   // //http://www.orangefreesounds.com/mp3-alarm-clock
                   //  aud.play();
                   //  aud.loop=true;
                   //  messagesRef.off("value");

                   document.getElementById('ring').click();
                }
            }
        });

    }
if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(weather);
}
    //location: 49.260605,-123.245994 -UBC
    //display weather info and load weather background on webpage
    function weather(position){
              userLat=position.coords.latitude;
              userLng=position.coords.longitude;
    var fullUrl="https://api.forecast.io/forecast/c041d01ad874a1877cd9917877f38154/"+userLat+","+userLng;
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

            weatherDiv.innerText="Currently "+ icon +" " + Math.round(temp)+" °C";

            switch(icon){
            case 'clear-day':
                background.style.backgroundImage='url("sunny.jpg")';
                break;
            case 'cloudy':
            case 'partly-cloudy-day':
            case 'partly-cloudy-night':
                background.style.backgroundImage='url("cloudy.jpg")';
                clockDiv.style.color='white';
                weatherDiv.style.color='white';
                break;
            case 'rain':
                background.style.backgroundImage='url("rainyDay.jpg")';
                clockDiv.style.color='white';
                weatherDiv.style.color='white';
                break;
            case 'wind':
                background.style.backgroundImage='url("thunder.jpg")';
                clockDiv.style.color='white';
                weatherDiv.style.color='white';
                break;
            case 'snow':
            case 'sleet':
                background.style.backgroundImage='url("snowy.jpg")';
                break;
            case 'fog':
                background.style.backgroundImage='url("mist.jpg")';
                break;
            case 'clear-night':
                background.style.backgroundImage='url("clearNight.jpg")';
                weatherDiv.style.color='white';
                clockDiv.style.color='white';
                break;
        }

        }
    });
    }

    var auto=setInterval(displayTime,1000); //display time every second


	// Set the minimum date to be today
	var _today = new Date().toLocaleString().split(',')[0].split('/');
    if(_today[0]<10){_today[0]='0'+_today[0];}
    if(_today[1]<10){_today[1]='0'+_today[1];}
    var today= _today[2]+'-'+_today[0]+'-'+_today[1];
    console.log(today);
    document.getElementById("alarmDate").setAttribute('min', today);
	var alarmDate=document.getElementById("alarmDate");


    var alarmHour=document.getElementById("alarmHour");
    var optionHour=document.createElement("option");
    optionHour.text="hr";
    alarmHour.add(optionHour,alarmHour[0]);

    //drop down for hour
    for(var j=1;j<13;j++){
        var option2=document.createElement("option");
        if(j<10){
            option2.text='0'+j;
        }else{
            option2.text=j;
        }
        alarmHour.add(option2,alarmHour[j]);
    }

    var alarmMinute=document.getElementById("alarmMinute");
    var optionMinute=document.createElement("option");
    optionMinute.text="min";

    //drop down for minute
    alarmMinute.add(optionMinute,alarmMinute[0]);

    for(var k=0;k<60;k++){
        var option3=document.createElement("option");
        if(k<10){
            option3.text='0'+k;
        }else{
            option3.text=k;
        }
        alarmMinute.add(option3,alarmMinute[k+1]);
    }

    //drop down for am/pm
    var alarmMeridiem=document.getElementById("alarmMeridiem");
    var optionAm=document.createElement("option");
    optionAm.text="am";
    alarmMeridiem.add(optionAm,alarmMeridiem[0]);
    var optionPm=document.createElement("option");
    optionPm.text="pm";
    alarmMeridiem.add(optionPm,alarmMeridiem[1]);

    //get root of data from firebase
    var messagesRef = new Firebase('https://281alarm.firebaseio.com/');

     var alarmAmount = document.createElement('label');
     alarmAmount.innerText = 0;

     document.getElementById('alarmIcon').appendChild(alarmAmount);


     messagesRef.on('child_added', function(snapshot){

        alarmAmount.innerText = parseInt(alarmAmount.innerText) + 1;

    });

    messagesRef.on('child_removed', function(snapshot){
         alarmAmount.innerText = parseInt(alarmAmount.innerText) - 1;

    });

    //set alarm listener
    var set=document.getElementById('setAlarm');
    set.onclick=function(){
        var alarmdate=document.getElementById('alarmDate').value;
        var alarmhour=document.getElementById('alarmHour').value;
        var alarmminute=document.getElementById('alarmMinute').value;
        var alarmmeridiem=document.getElementById('alarmMeridiem').value;
        var childRef;
        var currentId;
        var currentTime = new Date();
    if(alarmdate!==""&&alarmhour!='hr'&&alarmminute!='min'){
        childRef = messagesRef.child("alarm" + currentTime.getTime());
        childRef.set({id:currentTime.getTime(),date:alarmdate, hour:alarmhour, minute:alarmminute, meridiem:alarmmeridiem});
        document.getElementById('alarmPage').style.display="none";
    }

		  // if(alarmdate!==""&&alarmhour!='hr'&&alarmminute!='min'){
    //         console.log(storeId);
    //         //repopulate removed ids first
    //         if(number <= 10) {
    //             if(storeId.length===0){
    //                 childRef = messagesRef.child("alarm" + (number+1));
    //                 childRef.set({id:number+1,date:alarmdate, hour:alarmhour, minute:alarmminute, meridiem:alarmmeridiem});
    //             }else{
    //                 currentId=storeId.pop();
    //                 childRef = messagesRef.child("alarm" + (currentId));
    //                 childRef.set({id:currentId,date:alarmdate, hour:alarmhour, minute:alarmminute, meridiem:alarmmeridiem});
    //             }
    //         //alert fails when there are too many data
    //         }else {
    //             alert('maximum alarm set');
    //         }
    //     }else {
    //         alert('please select a day and time');
    //     }
    };



});
