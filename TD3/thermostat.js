/*****************************************************************************
*    Nom ......... : thermostat.js                                           *
*    Auteur ...... : Sebastien Chagnon #1804702, Genevieve Laroche #1827516  *
*    Role ........ :                                                         *    
*****************************************************************************/

var sliderParams = {
    min: -10, 
    max: 40,
    orientation: "vertical",
    value: 20,
    step: 1,
    slide: function( event, ui ) {
        updateViewThermostatValue(ui.value);
    }
}

var pipsParams = {
    rest: "label",
    step: 10
}

initialize();

function initialize() {
    initializeSlider();
    updateViewThermostatValue(sliderParams.value);
    chrono();
}

function initializeSlider() {
    $("#thermostat")
        .slider(sliderParams)
        .slider("pips", pipsParams)
        .slider("float");
}

function chrono() {
    ticTac();
    drawThermometer();
    updateViewHeatingActivation(chauffage);
    updateViewExteriorTemperature(temperatureExterieure);
    
    setTimeout(() => {
        chrono();
    }, 250);
}

function drawThermometer() {
    var c = document.getElementById("thermometer");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 30, 300);
    ctx.fillStyle = '#F00';
    ctx.fillRect(0, (50 - temperatureInterieure) * 3, 30, 400);
    ctx.font = "20px Arial";
    ctx.rotate((Math.PI / 2));
    ctx.strokeText(Math.round(temperatureInterieure * 10) / 10, 140, -7);
}

function updateViewThermostatValue(value) {
    document.getElementById("tdValeurThermostat").innerHTML = value;
}

function updateViewHeatingActivation(value) {
    document.getElementById("heatingActivation").innerHTML = value ? 'Actif' : 'Éteint';
}

function updateViewExteriorTemperature(value) {
    document.getElementById("exteriorTemperature").innerHTML = value;
}