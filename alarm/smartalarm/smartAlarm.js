//every page load
$(document).ready( function() {
    var clockDiv;
    var currentMode=0;
    var modeArr;
    var alarmCount=0;
    var number=0;

    //display time on webpage
    function displayTime() {
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();
        var date = currentTime.getDate();
        //var month = currentTime.getMonth()+1;
        var locale = "en-us";
        var month = currentTime.toLocaleString(locale, { month: "short" });
        var year = currentTime.getFullYear();
        var meridiem = "AM";
        if(hours>12){
            hours-=12;
            meridiem = "PM";
            if(hours==12){
                meridiem="AM";
            }
        }


        //make it to two digits for 1-9
        if(seconds<10) seconds="0"+seconds;
        if(minutes<10) minutes="0"+minutes;
        if(hours<10) hours="0"+hours;

        //get handler to clock div in html
        clockDiv = document.getElementById('clock');
        //set text inside clock div
        clockDiv.innerText = hours + ":" + minutes + ":" + seconds+
         " "+ meridiem +"\n" + month+" "+date+" "+year;
    }

    //display weather info and load weather background on webpage
    function weather(){
        //get weather data from forecast.io
        $.ajax({
        url: "https://api.forecast.io/forecast/c041d01ad874a1877cd9917877f38154/49.2611,-123.2531",
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

    weather();  //display weather
    var auto=setInterval(displayTime,1000); //display time every second


    var alarmDate=document.getElementById("alarmDate");
    var option=document.createElement("option");
    var days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    option.text="DD/MM/YY";

    alarmDate.add(option,alarmDate[0]);

    //drop down for date
    for(var i=0;i<7;i++){
        var option1=document.createElement("option");
        var date = new Date();
        date.setDate(date.getDate() + i);
        option1.text=days[i]+", "+date.getDate()+'/'+ (date.getMonth()+1) +'/'+date.getFullYear();
        alarmDate.add(option1,alarmDate[i+1]);
    }

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

    for(var k=1;k<60;k++){
        var option3=document.createElement("option");
        if(k<10){
            option3.text='0'+k;
        }else{
            option3.text=k;
        }
        alarmMinute.add(option3,alarmMinute[k]);
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

    //set alarm listener
    var set=document.getElementById('setAlarm');
    set.onclick=function(){
        var alarmdate=document.getElementById('alarmDate').value;
        var alarmhour=document.getElementById('alarmHour').value;
        var alarmminute=document.getElementById('alarmMinute').value;
        var alarmmeridiem=document.getElementById('alarmMeridiem').value;

        //send valid alarm data to firebase
        if(alarmdate!='DD/MM/YY'&&alarmhour!='hr'&&alarmminute!='min'){
            if(number <= 10) {
                var childRef = messagesRef.child("alarm" + (number+1));
                childRef.set({id:number+1,date:alarmdate, hour:alarmhour, minute:alarmminute, meridiem:alarmmeridiem});
            //alert fails when there are too many data
            }else { alert('maximum alarm set')};
        }else {
            alert('please select a day and time')
        };
    };

    //create alarm from firebase data
    messagesRef.on('child_added',function(snapshot){
        number++;
        var showAlarm=document.createElement("button");
        showAlarm.setAttribute("class","btn btn-primary btn-block");
        showAlarm.id= number;
        showAlarm.innerText=snapshot.val().date+" "+snapshot.val().hour+":"+snapshot.val().minute;
        document.body.appendChild(showAlarm);

        //remove alarm data and alarm object upon click
        showAlarm.onclick=function(){
            var childRef = messagesRef.child('alarm' + showAlarm.id);
            childRef.remove();
            var child = document.getElementById(showAlarm.id);
            child.parentNode.removeChild(child);
            number--;

            };

    });

});