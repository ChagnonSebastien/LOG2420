function initialize() {
    var latlng = new google.maps.LatLng(45.5187, -73.5776);
    var myOptions = {
        zoom: 10,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
            myOptions);
}

google.maps.event.addDomListener(window, "load", initialize);

var bixiData;
var availableTags;

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
    console.log(stationInformation);
}

function getIndex(stationName) {
    return availableTags.indexOf(stationName);
}

function getStationInformations(index) {
    console.log(bixiData);
    return bixiData.stations[index];
}