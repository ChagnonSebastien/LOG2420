/****************************************************************************
*    Nom ......... : factsage.js                                            *
*    Auteur ...... : Sebastien Chagnon #1804702, Genevieve Laroche #1827516 *
*    Role ........ : Interface du site factsage.com                         *    
*****************************************************************************/

function loadXMLDoc(file) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("view").innerHTML =
                this.responseText;
        }
    };
    xhttp.open("GET", file, true);
    xhttp.send();
}