$(document).ready(function () {
    initTypeUser();
})

function initTypeUser() {
    getTypeUser();
}

function getTypeUser() {
    $.ajax({
        type : 'GET',
        url : '/api/type_user',
        dataType: "json",
        beforeSend : function () {
            
        },
        success : function (datas) {
            if (datas.getEtat) {
                var typesBlock = $("#types").next();
                if (datas.getObjet.length > 0) {

                    //Met dans le span le type par defaut
                    typesBlock[0].getElementsByClassName('current')[0].innerHTML = datas.getObjet[0].intitule;
                    datas.getObjet.map(type_user => {
                        var contentTypeOption = `<option value="${type_user._id}">${type_user.intitule}</option>`,
                            contentTypeLi = `<li class="option" data-value="${type_user._id}">${type_user.intitule}</li>`;
                        typesBlock[0].getElementsByClassName('list')[0].innerHTML += contentTypeLi;
                        $("#types").append(contentTypeOption);
                    })
                }
            }
        }
    })
}