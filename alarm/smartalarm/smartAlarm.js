$(document).ready( function() {
    var clockDiv;
    var currentMode=0;
    var count=0;
    var modeArr;



    //This code will run after your page loads
    // var GoogleMapsLoader = require('google-maps');      // only for common js environments

    // GoogleMapsLoader.load(function(google) {
    //     new google.maps.Map(el, options);
    // });

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
    function print(){
        clockDiv = document.getElementById('clock');
        clockDiv.innerText="a";
    }
    function weather(){
        $.ajax({
        url: "https://api.forecast.io/forecast/c041d01ad874a1877cd9917877f38154/49.2611,-123.2531",
        dataType: "jsonp",
        success: function (data) {
            var icon=data.currently.icon;
            var temp=(data.currently.temperature-32)/1.8;
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
    // function weather(){
    //     $.get("https://api.forecast.io/forecast/c041d01ad874a1877cd9917877f38154/37.8267,-122.423", function(data, status){
    //     var icon=data.weather[0].icon;
    //     var description=data.weather[0].description;
    //     var temp=data.main.temp-273.15;
    //     var background = document.getElementById('background');
    //     clockDiv = document.getElementById('clock');
    //     weatherDiv=document.getElementById('weather');
    //     weatherDiv.innerText="Currently "+ description +" " + Math.round(temp)+" °C";
    //     switch(icon){
    //         case '01d':
    //         case '02d':
    //             background.style.backgroundImage='url("sunny.jpg")';
    //             break;
    //         case '03d':
    //         case '04d':
    //         case '03n':
    //         case '04n':
    //             background.style.backgroundImage='url("cloudy.jpg")';
    //             clockDiv.style.color='white';
    //             weatherDiv.style.color='white';
    //             break;
    //         case '09d':
    //         case '10d':
    //         case '09n':
    //         case '10n':
    //             background.style.backgroundImage='url("rainyDay.jpg")';
    //             clockDiv.style.color='white';
    //             weatherDiv.style.color='white';
    //             break;
    //         case '11d':
    //         case '11n':
    //             background.style.backgroundImage='url("thunder.jpg")';
    //             clockDiv.style.color='white';
    //             weatherDiv.style.color='white';
    //             break;
    //         case '13d':
    //         case '13n':
    //             background.style.backgroundImage='url("snowy.jpg")';
    //             break;
    //         case '50d':
    //         case '50n':
    //             background.style.backgroundImage='url("mist.jpg")';
    //             break;
    //         case '01n':
    //         case '02n':
    //             background.style.backgroundImage='url("clearNight.jpg")';
    //             weatherDiv.style.color='white';
    //             clockDiv.style.color='white';
    //             break;
    //     }

    //     // ="Today weather is "+ description +".\nHigh:"+tempHigh+"Low:"+tempLow;
    //     });
    // }
    weather();
    // modeArr=[
    //     print,
    //     weather,
    //     setInterval
    // ];

    //run clock from start
    var auto=setInterval(displayTime,1000);

    //bad model of running continuous event in onclick(set interval run function at every x ms, clear manually )
    //huge delay
    // var mode=document.getElementById('modes');
    // mode.onclick=function() {

    //     if(modeArr[0]==print){
    //         currentMode=1;
    //     }else if(modeArr[0]==weather)
    //     {
    //         currentMode=2;
    //     }else{
    //         currentMode=0;
    //     }
    //     switch(currentMode){
    //     case 1:
    //         clearInterval(auto);
    //         print();
    //         break;
    //     case 2:
    //         clearInterval(auto);
    //         weather();
    //         break;
    //     default:
    //         auto=setInterval(displayTime,1000);
    //     }

    //     modeArr.push(modeArr.splice(0,1)[0]);   //sequential loop
    // };
    var alarmDate=document.getElementById("alarmDate");
    var option=document.createElement("option");
    var days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    option.text="DD/MM/YY";


    alarmDate.add(option,alarmDate[0]);


    for(var i=0;i<7;i++){
        var option1=document.createElement("option");
        option1.text=days[i];
        alarmDate.add(option1,alarmDate[i+1]);
    }

    var alarmHour=document.getElementById("alarmHour");
    var optionHour=document.createElement("option");
    optionHour.text="hr";


    alarmHour.add(optionHour,alarmHour[0]);

    for(var j=1;j<13;j++){
        var option2=document.createElement("option");
        option2.text=j;
        alarmHour.add(option2,alarmHour[j]);
    }


    var alarmMinute=document.getElementById("alarmMinute");
    var optionMinute=document.createElement("option");
    optionMinute.text="min";


    alarmMinute.add(optionMinute,alarmMinute[0]);

    for(var j=1;j<60;j++){
        var option2=document.createElement("option");
        option2.text=j;
        alarmMinute.add(option2,alarmMinute[j]);
    }


    var alarmMeridiem=document.getElementById("alarmMeridiem");
    var optionAm=document.createElement("option");
    optionAm.text="am";
    alarmMeridiem.add(optionAm,alarmMeridiem[0]);
    var optionPm=document.createElement("option");
    optionPm.text="pm";
    alarmMeridiem.add(optionPm,alarmMeridiem[1]);
    var set=document.getElementById('setAlarm');

    //just write something to the end of the page
    set.onclick=function(){
        var showAlarm=document.createElement("div");
        document.body.appendChild(showAlarm);
        var alarms=new Object();
        alarms.date=document.getElementById('alarmDate').selectedIndex;
        alarms.hour=document.getElementById('alarmHour').selectedIndex;
        alarms.minute=document.getElementById('alarmMinute').selectedIndex;
        alarms.meridiem=document.getElementById('alarmMeridiem').selectedIndex;
        showAlarm.innerText=JSON.stringify(alarms);
    };
    //$('alarm').onclick=
});

