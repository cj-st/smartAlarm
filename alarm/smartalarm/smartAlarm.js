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
        }else{
            meridiem="AM";
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

        //turn off listener when done
        messagesRef.on('value',function(snapshot){
            for(var id in snapshot.val()){
                if((snapshot.val()[id].date.indexOf(date+'/'+ monthNum +'/'+year)!=-1) && snapshot.val()[id].hour==hours && snapshot.val()[id].minute==minutes &&seconds=="00"){
                    var aud =document.createElement("audio");
                    aud.setAttribute("id","aud" +snapshot.val()[id].id);
                    console.log(aud.id);
                    aud.setAttribute("src","alarm.mp3");
                    document.getElementById("myAudio").appendChild(aud);
                   //http://www.orangefreesounds.com/mp3-alarm-clock
                    aud.play();
                    aud.loop=true;
                    messagesRef.off("value");
                    break;
                }
            }
        });

    }
    //location: 49.260605,-123.245994 -UBC
    //display weather info and load weather background on webpage
    function weather(){
        //get weather data from forecast.io
        $.ajax({
        url: "https://api.forecast.io/forecast/c041d01ad874a1877cd9917877f38154/49.260605,-123.245994",
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
    var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    option.text="DD/MM/YY";

    alarmDate.add(option,alarmDate[0]);

    //drop down for date
    for(var i=0;i<7;i++){
        var option1=document.createElement("option");
        var optionDate = new Date();
        optionDate.setDate(optionDate.getDate() + i);
        option1.text=days[optionDate.getDay()]+", "+optionDate.getDate()+'/'+ (optionDate.getMonth()+1) +'/'+optionDate.getFullYear();
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

    //set alarm listener
    var set=document.getElementById('setAlarm');
    set.onclick=function(){
        var alarmdate=document.getElementById('alarmDate').value;
        var alarmhour=document.getElementById('alarmHour').value;
        var alarmminute=document.getElementById('alarmMinute').value;
        var alarmmeridiem=document.getElementById('alarmMeridiem').value;
        var childRef;
        var currentId;
        //send valid alarm data to firebase
        //could check if alarm has been set(more work)
        if(alarmdate!='DD/MM/YY'&&alarmhour!='hr'&&alarmminute!='min'){
            console.log(storeId);
            //repopulate removed ids first
            if(number <= 10) {
                if(storeId.length===0){
                    childRef = messagesRef.child("alarm" + (number+1));
                    childRef.set({id:number+1,date:alarmdate, hour:alarmhour, minute:alarmminute, meridiem:alarmmeridiem});
                }else{
                    currentId=storeId.pop();
                    childRef = messagesRef.child("alarm" + (currentId));
                    childRef.set({id:currentId,date:alarmdate, hour:alarmhour, minute:alarmminute, meridiem:alarmmeridiem});
                }
            //alert fails when there are too many data
            }else {
                alert('maximum alarm set');
            }
        }else {
            alert('please select a day and time');
        }
    };

    //create alarm from firebase data
    messagesRef.on('child_added',function(snapshot){
        number++;
        var showAlarm=document.createElement("button");
        showAlarm.setAttribute("class","btn btn-primary");
        showAlarm.id= snapshot.val().id;
        showAlarm.innerText=snapshot.val().date+" "+snapshot.val().hour+":"+snapshot.val().minute;
        document.getElementById("alarms").appendChild(showAlarm);

        //remove alarm data and alarm object upon click
        showAlarm.onclick=function(){
            //store id to be remove in array
            currentId=showAlarm.id;
            storeId.push(currentId);
            console.log(showAlarm.id);
            console.log(number);
            //taking into account user can remove button that is not ringing
            if(document.getElementById("aud"+showAlarm.id)!==null){
                var audio = document.getElementById('aud'+showAlarm.id);
                audio.parentNode.removeChild(audio);
            }

            var childRef = messagesRef.child('alarm' + showAlarm.id);
            childRef.remove();
            var child = document.getElementById(showAlarm.id);
            child.parentNode.removeChild(child);

            number--;
            };

    });
    //draw map(not needed)
    // function GetMap() {
    //     var myOptions = {
    //         zoom: 8,
    //         center: { lat: 49.2611, lng: -123.2531},
    //     };
    //     map = new google.maps.Map(document.getElementById("mapContainer"),myOptions);
    // }
    // google.maps.event.addDomListener(window, 'load', GetMap);

    //address to lat lng(not needed)
    // var geocoder = new google.maps.Geocoder();
    // var address = "UBC,Vancouver,CA";
    // var address1 = "SFU,Burnaby,CA";

    // geocoder.geocode( { 'address': address1}, function(results, status) {

    //     if (status == google.maps.GeocoderStatus.OK) {
    //         latlng= results[0].geometry.location.lat()+','+results[0].geometry.location.lng();
    //     console.log(latlng);
    //     }
    // });



    //might want to call window.unload/refresh after ajax finishes
    document.getElementById("submit").onclick= function()
    {
        address1 =document.getElementById("origin").value;
        address2 =document.getElementById("destination").value;
        console.log(address1);
        //traffic data only valid for business customer(find other means)

        //origin:49.260605,-123.245994 -UBC
        //dest:  49.278094,-122.919883 -SFU
        //mode: default to driving
        //language: en -English
        //use of proxy to encode into jsonp format
        var mapsUrl    = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+address1+'&destinations='+address2+'&mode=driving&language=en&key=AIzaSyCD9gW0p7LS9Y5gLs8gHCgrV1WplVLU1E8';
        var encodedUrl = encodeURIComponent(mapsUrl);
        var proxyUrl   = 'https://jsonp.afeld.me/?url=' + encodedUrl;
        console.log(mapsUrl);
        $.ajax({
            url: proxyUrl,
            dataType: 'jsonp',
            cache: false,
            success: function (data) {
                console.log(data.status);
                if(data.status!=='INVALID_REQUEST'){
                    document.getElementById("report").innerText="Distance:"+data.rows[0].elements[0].distance.text+"\nTime:"+data.rows[0].elements[0].duration.text;
                    document.getElementById("report").style.color='white';
                }else{
                    alert('Enter a valid address!');
                }
            },

        });


    };





});