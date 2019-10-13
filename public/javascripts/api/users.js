$(document).ready(function () {
    initUsers();
})

function initUsers() {
    login();
    getUserId(function (flag, user_id) {
        if (flag) {
            userNavInfo(user_id);
        }
    })
}

function login() {
    document.getElementById("loginForm").addEventListener("submit", (e) => {
        e.preventDefault();
        var objData = {};

        for (let index = 0; index < e.target.elements.length; index++) {
            objData[e.target.elements[index].name] = e.target.elements[index].value
        }

        //Ajax pour interrogé le côté serveur
        $.ajax({
            type: 'POST',
            url: "/api/login",
            dataType: "json",
            data: objData,
            before: {},
            success: function (data) {
                if (data.getEtat) {
                    window.location.href = "/";
                } else {
                    alert(data.getMessage);
                }
            }
        });
    })
}

/**
 * Rend le menu dynamique par rapport a l'id
 * @param {user_id} user_id, l'identifiant 
 */
function userNavInfo(user_id) {
    $.ajax({
        type: 'GET',
        url: "/api/infoForAnyUser/" + user_id,
        before: {},
        success: function (data) {
            var contentProfileInfos = `<a style="color:#93c900;font-size:17px;" href="/profile/${data.getObjet._id}/informations" class="pull-right">
                                        <img style="width:40px;height:40px;" src="/images/bg-img/1b3721afd0d0dbceebdb8bce26df9470-s120.jpg "/>&nbsp;<span>${data.getObjet.prenom}&nbsp;${data.getObjet.nom}</span>
                                    </a>`,
                contentOtherNav = `<a class="active" href="#"><i class="iconsProfile now-ui-icons ui-1_bell-53" aria-hidden="true"></i></a>`;
            // $("#navAdditionalForUser").append(contentOtherNav);
            $("#navUser").append(contentProfileInfos);
        }
    });
}


