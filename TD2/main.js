var bixiData;
var availableTags;
var tableData;
var map;
var marker;

var language = "fr";

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

    tableData = data.stations.map(station => {
        return [station.id, station.s, station.ba, station.da, station.b, station.su];
    })
    loadTable();

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

function toggleLanguage() {
    language = language === "fr" ? "en" : "fr";
    reloadLanguage();
}

function reloadLanguage() {
    $.getJSON('./lang/' + language + '.json', function(data) {
        document.getElementById("title").innerText = data.title;
        document.getElementById("home").innerText = data.home;
        document.getElementById("map-title").innerText = data.map.title;
        document.getElementById("map-localisation").innerText = data.map.localisation;
        document.getElementById("map-noSelection").innerText = data.map.noSelection;
        document.getElementById("map-stateTable-title").innerText = data.map.stateTable.title;
        document.getElementById("map-stateTable-id").innerText = data.map.stateTable.id;
        document.getElementById("map-stateTable-blocked").innerText = data.map.stateTable.blocked;
        document.getElementById("map-stateTable-suspended").innerText = data.map.stateTable.suspended;
        document.getElementById("map-stateTable-noService").innerText = data.map.stateTable.noService;
        document.getElementById("map-stateTable-bikesAvailable").innerText = data.map.stateTable.bikesAvailable;
        document.getElementById("map-stateTable-bikesUnavailable").innerText = data.map.stateTable.bikesUnavailable;
        document.getElementById("map-stateTable-terminalsAvailable").innerText = data.map.stateTable.terminalsAvailable;toggleLanguage
        document.getElementById("map-stateTable-terminalsUnavailable").innerText = data.map.stateTable.terminalsUnavailable;
        document.getElementById("list-title").innerText = data.list.title;
    });
}

function loadTable() {
    console.log(tableData);
    $(document).ready(function() {
        $('#list_table').DataTable( {
            data: tableData,
            columns: [
                { title: "ID" },
                { title: "Nom Station" },
                { title: "Vélos disponibles" },
                { title: "Bornes Disponibles" },
                { title: "État bloqué" },
                { title: "État suspendu" }
            ]
        } );
    });
}