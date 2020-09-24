var ulMode;

$(document).ready(function () {
    initModeImmo();
})

function initModeImmo() {
    ulMode = $("#navMode");
    setModeImmoOnNavbar();
}

function setModeImmoOnNavbar() {
    $.ajax({
        type: 'GET',
        url: "/api/getAllMode",
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                if (data.getObjet.length > 0) {
                    data.getObjet.map(mode => {
                        var contentMode = `<li><a href="/immo/${mode.intitule}/${mode._id}/liste">Immobiliers en ${mode.intitule}</a></li>`;
                        var contentModeInFooter = `<li><a href="/immo/${mode.intitule}/${mode._id}/liste">Immobiliers en ${mode.intitule}</a></li>`;

                        $("#navMode").append(contentMode);
                        $("#modeInFooter").append(contentModeInFooter);
                    });
                }
            }
            
        }
    });
}

/* Recupere les modes */
function getAllMode(callback) {
    $.ajax({
        type: 'GET',
        url: "/api/getAllMode",
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                if (data.getObjet.length > 0) {
                    callback(data.getObjet);
                }
            }
            
        }
    });
}

/** Recupere tous les types de loyer */
function getAllRent(callback) {
    $.ajax({
        type: 'GET',
        url: "/api/type_rent",
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.state) {
                if (data.result.length > 0) {
                    callback(data.result);
                }
            }
            
        }
    });
}