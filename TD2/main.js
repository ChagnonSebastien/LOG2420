/**********************************************************************
 *                             Bixi data                              *
 **********************************************************************/

var bixiData, activeStation;

function initializeBixiData(name) {
    $.getJSON('https://secure.bixi.com/data/stations.json', function(data) {
        bixiData = data;

        parseDataForTable(data);
        loadStationTable();
    });
}

function updateStation(name) {
    var index = this.getIndex(name);
    var stationInformation = this.getStationInformations(index);
    updateStationDescriptionTable(stationInformation);
    updateStationOnMap(stationInformation);
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

/**********************************************************************
 *                            Autocomplete                            *
 **********************************************************************/

var availableTags;

function parseAutocompleteData(bixiData) {
    availableTags = data.stations.map((station) => {
        return station.s;
    });
}

function initializeAutocomplete(bixiData) {
    $( "#tags" ).autocomplete(
        {
            source: availableTags,
            select: function( event, ui ) {
                updateStation(ui.item.value)
            }
        }
    );
}

/**********************************************************************
 *                 Station specific information table                 *
 **********************************************************************/

function updateStationDescriptionTable(stationInformation) {
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
    document.getElementById(id).innerHTML =
        "<span class=\"bubble_" + bubbleColor + "\">" + getBooleanLanguageAlternative(value) + "</span>";
}

function setBoolean(id, value) {
    var bubbleColor = value === "true" ? "red" : "green";
    document.getElementById(id).innerHTML =
        "<span class=\"bubble_" + bubbleColor + "\">" + getBooleanLanguageAlternative(value) + "</span>";
}

/**********************************************************************
 *                            Map methods                             *
 **********************************************************************/

var map, marker;
google.maps.event.addDomListener(window, "load", initializeMap);

function initializeMap() {
    var coordinates = new google.maps.LatLng(45.5187, -73.5776);
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: coordinates,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
}

function updateStationOnMap(stationInformation) {
    var coordinates = new google.maps.LatLng(stationInformation.la, stationInformation.lo);
    updateMarker(coordinates);
    updateMapCenter(coordinates);
}

function updateMarker(coordinates) {
    if (marker !== undefined) {
        marker.setVisible(false);
    }

    marker = new google.maps.Marker({
        map,
        position: coordinates
    });
}

function updateMapCenter(coordinates) {
    map.setCenter(coordinates);
    map.setZoom(17);
}

/**********************************************************************
 *                          Language methods                          *
 **********************************************************************/

var language = "fr";
var languageGeneralData;
reloadLanguage();

function toggleLanguage() {
    language = language === "fr" ? "en" : "fr";
    reloadLanguage();
}

function reloadLanguage() {
    $.getJSON('./lang/' + language + '.json', function(languageData) {
        languageGeneralData = languageData.general;
        reloadStrings(languageData);
        loadStationTable(tableData, languageData);
    });
}

function reloadStrings(languageData) {
    reloadMiscStrings(languageData);
    reloadStationDescriptionTableStrings(languageData);
    reloadStationsStrings(languageData);
}

function reloadStationDescriptionTableStrings(generalLanguageData) {

}

function getBooleanLanguageAlternative(value) {
    return value ? generalLanguageData.yes : generalLanguageData.no;
}

function reloadStationsStrings(languageData) {

}

function reloadMiscStrings(languageData) {
    document.getElementById("title").innerText = languageData.title;
    document.getElementById("home").innerText = languageData.home;
    document.getElementById("map-title").innerText = languageData.map.title;
    document.getElementById("map-localisation").innerText = languageData.map.localisation;
    document.getElementById("map-noSelection").innerText = languageData.map.noSelection;
    document.getElementById("map-stateTable-title").innerText = languageData.map.stateTable.title;
    document.getElementById("map-stateTable-id").innerText = languageData.map.stateTable.id;
    document.getElementById("map-stateTable-blocked").innerText = languageData.map.stateTable.blocked;
    document.getElementById("map-stateTable-suspended").innerText = languageData.map.stateTable.suspended;
    document.getElementById("map-stateTable-noService").innerText = languageData.map.stateTable.noService;
    document.getElementById("map-stateTable-bikesAvailable").innerText = languageData.map.stateTable.bikesAvailable;
    document.getElementById("map-stateTable-bikesUnavailable").innerText = languageData.map.stateTable.bikesUnavailable;
    document.getElementById("map-stateTable-terminalsAvailable").innerText = languageData.map.stateTable.terminalsAvailable;toggleLanguage
    document.getElementById("map-stateTable-terminalsUnavailable").innerText = languageData.map.stateTable.terminalsUnavailable;
    document.getElementById("list-title").innerText = languageData.list.title;
}

/**********************************************************************
 *                          Stations table                            *
 **********************************************************************/

var tableData;

function parseDataForTable(bixiData) {
    tableData = data.stations.map(station => {
        return [station.id, station.s, station.ba, station.da, station.b, station.su];
    })
}

function loadStationTable(tableData, languageData) {
    $(document).ready(function() {
        $('#list_table').DataTable( {
            data: tableData,
            columns: [
                { title: languageData.list.id },
                { title: languageData.list.stationName },
                { title: languageData.list.bikesAvailable },
                { title: languageData.list.terminalsAvailable },
                { title: languageData.list.stateBlocked },
                { title: languageData.list.stateSuspended }
            ]
        } );
    });
}

/**********************************************************************
 *                            Initialize                              *
 **********************************************************************/