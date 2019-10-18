function getHostAPI() {
    //return "http://localhost:3333";
    return "https://immo-jach-api.herokuapp.com";
}
/**
 * Fonction permettant de récupérer l'identifiant de l'utilisateur en session
 * @param {Function} callback La fonction de retour
 */
function getUserId(callback) {

    $.ajax({
        type: 'GET',
        url: "/api/userid",
        dataType: "json",
        success: function (data) {
            if (data) {
                callback(true, data.id_client)
            } else {
                callback(false, null)
            }
        }
    });
}

/**
 * Fonction permettant de récupérer le type de l'utilisateur en session
 * @param {Function} callback La fonction de retour
 */
 function getTypeForUser(callback) {
    $.ajax({
        type: 'GET',
        url: "/api/SessionType",
        dataType: "json",
        success: function (data) {
            if (data) {
                callback(data.type_user)
            } else {
                callback(null)
            }
        },
        error : function (err) {
            console.log(err)
        }
    });
 }

/**
 * Fonction permettant de gerer les inputs de type select
 * @param {array} le tableau contenant les donnees
 * @param string l'id de l'input
 */
 function dynamiqueInput(data, id) {
     var typeImmoAddBlock = $("#" + id).next();

        //Met dans le span le type par defaut
        typeImmoAddBlock[0].getElementsByClassName('current')[0].innerHTML = data[0].intitule;
        data.map(type_user => {
            var contentTypeOption = `<option value="${type_user._id}">${type_user.intitule}</option>`,
                contentTypeLi = `<li class="option" data-value="${type_user._id}">${type_user.intitule}</li>`;
            typeImmoAddBlock[0].getElementsByClassName('list')[0].innerHTML += contentTypeLi;
            $("#" + id).append(contentTypeOption);
       })
}
