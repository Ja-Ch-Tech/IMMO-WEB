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
            console.log(data);           
            if (data.getEtat) {
                if (data.getObjet.length > 0) {
                    
                    data.getObjet.map(item => {
                        var content = `<li><a href="/immo/type/${item._id}/liste">${item.intitule} (5)</a></li>`;
                        var contentForFooter = `<li><a href="/immo/type/${item._id}/liste"><i class="fa fa-map-marker"></i> ${item.intitule}</a></li>`;

                        dropTypeImmo.append(content);
                        footerTypeImmo.append(contentForFooter);
                    })

                }
            }
        }
    });
}