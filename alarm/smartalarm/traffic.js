//every page load
$(document).ready( function() {
    tomtom.apiKey = "pw7q86ngkxnqw37exmyrxsje";

    if (!tomtom.apiKey)
        alert("Please edit apikey.js and enter your API key. The examples will not function until an API key has been entered.");

    tomtom.setImagePath("TomTom-JavaScript-SDK-2.1.0/images/");
// show the map with traffic, center on NYC
                // var map = new tomtom.Map({
                //     domNode: "map",
                //     displayTraffic: true,
                //     center: [49.2827,-123.1207],
                //     zoom: 12
                // });
var map = new tomtom.Map({
                    domNode: "map",
                    displayTraffic: true,
                    center: [49.260605,-123.245994],
                    zoom:10
                });

                // create the route control
                var routeControl = new tomtom.controls.RouteControl({
                    map: map,
                    domNode: "route"
                });

});