/*****************************************************************************
*    Nom ......... : main.js                                                 *
*    Auteur ...... : Sebastien Chagnon #1804702, Genevieve Laroche #1827516  *
*    Role ........ : Variables et fonctions de  l'application Bixi Helper    *
*                    qui permet la recherche et l'affichage du statut des    *
*                    bornes bixi dans la grande région de Montréal.          *    
*****************************************************************************/

var bixiData, activeStation;

function initializeBixiData(name) {
    $.getJSON('https://secure.bixi.com/data/stations.json', function(data) {
        bixiData = data;

        parseAutocompleteData(data);
        initializeAutocomplete();

        parseDataForTable(data);
        reloadLanguage();
    });
}

function updateStation(name) {
    var index = this.getIndex(name);
    activeStation = this.getStationInformations(index);
    
    updateStationDescriptionTable(activeStation);
    updateStationOnMap(activeStation);
    updateActiveStation(activeStation);
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
 *                   Fonction d'autocompletion                        *
 **********************************************************************/

var availableTags;

function parseAutocompleteData(bixiData) {
    availableTags = bixiData.stations.map((station) => {
        return station.s;
    });
}

function initializeAutocomplete() {
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
 *         Tableau d'état de la station de vélo sélectionnée          *
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
        "<span class=\"bubble_" + bubbleColor + "\">" + value + "</span>";
}

function setBoolean(id, value) {
    var bubbleColor = value === "true" ? "red" : "green";
    document.getElementById(id).innerHTML =
        "<span class=\"bubble_" + bubbleColor + "\">" + getBooleanLanguageAlternative(value) + "</span>";
}

/**********************************************************************
 *             Méthodes de la carte "Google maps"                     *
 **********************************************************************/

var map, marker;

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
 *           Méthodes liées à la modification de la langue            *
 **********************************************************************/

var language = "fr";
var languageGeneralData;

function toggleLanguage() {
    language = language === "fr" ? "en" : "fr";
    reloadLanguage();
}

function reloadLanguage() {
    $.getJSON('./lang/' + language + '.json', function(languageData) {
        languageGeneralData = languageData.general;
        reloadStrings(languageData);
        loadStationTable(languageData);
    });
}

function getBooleanLanguageAlternative(value) {
    return value ? languageGeneralData.yes : languageGeneralData.no;
}

function reloadStrings(languageData) {
    document.getElementById("title").innerText = languageData.title;
    document.getElementById("home").innerText = languageData.home;
    document.getElementById("map-title").innerText = languageData.map.title;
    document.getElementById("map-localisation").innerText = languageData.map.localisation;
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
    document.getElementById("list-description").innerText = languageData.list.description;

    if (activeStation === undefined) {
        document.getElementById("map-noSelection").innerText = languageData.map.noSelection;
    } else {
        updateStationDescriptionTable(activeStation);
    }
}

/**********************************************************************
 *         Liste de toutes les stations Bixi et leurs états           *
 **********************************************************************/

var tableData, table;

function parseDataForTable(bixiData) {
    tableData = bixiData.stations.map(station => {
        return [station.id, station.s, station.ba, station.da, station.b, station.su];
    })
}

function loadStationTable(languageData) {
    $.getJSON(
        language === "fr" ?
        'http://cdn.datatables.net/plug-ins/1.10.13/i18n/French.json' :
        'https://cdn.datatables.net/plug-ins/1.10.13/i18n/English.json',
    function(tableLanguage) {
        table = $('#list_table').DataTable( {
            language: tableLanguage,
            data: tableData.map(station => {
                return [
                    station[0],
                    station[1],
                    station [2],
                    station[3],
                    getBooleanLanguageAlternative(station[4]),
                    getBooleanLanguageAlternative(station[5])
                ]
            }),
            destroy: true,
            columns: [
                { title: languageData.list.id },
                { title: languageData.list.stationName },
                { title: languageData.list.bikesAvailable },
                { title: languageData.list.terminalsAvailable },
                { title: languageData.list.stateBlocked },
                { title: languageData.list.stateSuspended }
            ]
        });
    });
}

/**********************************************************************
 *                            Initialisation                          *
 **********************************************************************/

initializeBixiData();
initializeAutocomplete();
initializeMap();