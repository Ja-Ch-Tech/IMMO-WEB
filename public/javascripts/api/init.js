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
 function getTypeUser() {
    console.log("mbuyu")
 }
 