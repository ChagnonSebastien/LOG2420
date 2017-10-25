function initialize() {
    var latlng = new google.maps.LatLng(45.5187, -73.5776);
    var myOptions = {
        zoom: 10,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    var map = new google.maps.Map(document.getElementById("map"),
            myOptions);
}

google.maps.event.addDomListener(window, "load", initialize);