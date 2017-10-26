var bixiData;
var availableTags;
var map;
var marker;

var language = "en";
var languageElements = document.getElementsByClassName("languageListener");

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
    updateActiveStation(stationInformation);
}

function getIndex(stationName) {
    return availableTags.indexOf(stationName);
}

function getStationInformations(index) {
    return bixiData.stations[index];
}

function updateActiveStation(stationInformation) {
    document.getElementById("station_name").innerHTML = stationInformation.s;
}

function updateTable(stationInformation) {
    setNumber("station_id", stationInformation.id, true);
    setBoolean("station_blocked", stationInformation.b);
    setBoolean("station_unavailable", stationInformation.m);
    setBoolean("station_suspended", stationInformation.su);
    setNumber("bikes_available", stationInformation.da);
    setNumber("bikes_unavailable", stationInformation.dx, true);
    setNumber("bornes_available", stationInformation.ba);
    setNumber("bornes_unavailable", stationInformation.bx, true);
}

function setNumber(id, value, greyOverride = false) {
    var bubbleColor = value === 0 ? "red" : "green";
    bubbleColor = greyOverride ? "grey" : bubbleColor;
    document.getElementById(id).innerHTML = "<span class=\"bubble_" + bubbleColor + "\">" + value + "</span>";
}

function setBoolean(id, value) {
    var bubbleColor = value === "true" ? "red" : "green";
    document.getElementById(id).innerHTML = "<span class=\"bubble_" + bubbleColor + "\">" + value + "</span>";
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
    map.setZoom(17);
}

function french() {
    language = "fr";
    $.getJSON('./lang/' + language + '.json', function(data) {
        console.log(data);
        for (var i = 0; i < languageElements.length; i++) {
            console.log(languageElements[0], languageElements[0].getAttribute("languageLabel"));
        }
    });
}