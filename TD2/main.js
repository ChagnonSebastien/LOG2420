var bixiData;
var availableTags;
var map;
var marker;

function initialize() {
    var latlng = new google.maps.LatLng(45.5187, -73.5776);
    var myOptions = {
        zoom: 10,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"),
            myOptions);
}

google.maps.event.addDomListener(window, "load", initialize);

$.getJSON('https://secure.bixi.com/data/stations.json', function(data) {
    bixiData = data;

    availableTags = data.stations.map((station) => {
        return station.s;
    });

    $( "#tags" ).autocomplete(
        {
            source: availableTags,
            select: function( event, ui ) {updateStation(ui.item.value)}
        }
    );
});

function updateStation(name) {
    var index = this.getIndex(name);
    var stationInformation = this.getStationInformations(index);
    updateTable(stationInformation);
    updateMap(stationInformation);
}

function getIndex(stationName) {
    return availableTags.indexOf(stationName);
}

function getStationInformations(index) {
    return bixiData.stations[index];
}

function updateTable(stationInformation) {
    document.getElementById("station_id").innerHTML = stationInformation.id;
    document.getElementById("station_blocked").innerHTML = stationInformation.b;
    document.getElementById("station_unavailable").innerHTML = stationInformation.m;
    document.getElementById("station_suspended").innerHTML = stationInformation.su;
    document.getElementById("bikes_available").innerHTML = stationInformation.da;
    document.getElementById("bikes_unavailable").innerHTML = stationInformation.dx;
    document.getElementById("bornes_available").innerHTML = stationInformation.ba;
    document.getElementById("bornes_unavailable").innerHTML = stationInformation.bx;
}

function updateMap(stationInformation) {
    if (marker !== undefined) {
        marker.setVisible(false);
    }

    var latlng = new google.maps.LatLng(stationInformation.la, stationInformation.lo);
    var myOptions = {
        map,
        position: latlng
    }
    marker = new google.maps.Marker(myOptions);

    map.setCenter(latlng);
    map.setZoom(15);
}