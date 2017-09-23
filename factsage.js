/****************************************************************************
*    Nom ......... : factsage.js                                            *
*    Auteur ...... : S�bastien Chagnon #1804702, Genevi�ve Laroche #1827516 *
*    R�le ........ : Interface du site factsage.com                         *    
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