var dropTypeImmo, footerTypeImmo;

$(document).ready(function () {
    initTypeImmo();
})

function initTypeImmo() {
    dropTypeImmo = $("#dropTypeImmo");
    footerTypeImmo = $("#footerTypeImmo");
    setTypeImmoOnNavbar();
}

function setTypeImmoOnNavbar() {
    $.ajax({
        type: 'GET',
        url: "/api/getTypeImmo",
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                if (data.getObjet.length > 0) {
                    
                    data.getObjet.map(item => {
                        var content = `<li><a href="/immo/type/${item._id}/liste">${item.intitule} (${item.nbre})</a></li>`;
                        var contentForFooter = `<li><a href="/immo/type/${item._id}/liste"><i class="fa fa-map-marker"></i> ${item.intitule}</a></li>`;

                        dropTypeImmo.append(content);
                        footerTypeImmo.append(contentForFooter);
                    })

                }
            }
        }
    });
}

function getTypeImmo(callback) {
    $.ajax({
        type: 'GET',
        url: "/api/getTypeImmo",
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

function getTarifImmo(value, callback) {
    console.log(value);
    $.ajax({
        type: 'GET',
        url: `/api/pricing/${value}/getAll`,
        dataType: "json",
        success: function (data) {
            if (data.state) {
                if (data.result.length > 0) {
                    callback(data.result);
                }
            }
        }
    });
}

function getTypeHouse(callback) {
    $.ajax({
        type: 'GET',
        url: "/api/typeHouse/getAll",
        dataType: "json",
        success: function (data) {
            if (data.state) {
                if (data.result.length > 0) {
                    callback(data.result);
                }
            }
        }
    });
}



