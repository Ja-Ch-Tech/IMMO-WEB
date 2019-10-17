var dataAvatar;
$(document).ready(function () {
    initUsers();
})

function initUsers() {
    login();
    getUserId(function (flag, user_id) {
        if (user_id) {
            userNavInfo(user_id);

            if (/profile/i.test(window.location.pathname.split("/")[1]) && /photo/i.test(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])) {
                upload();
                updateAvatar(user_id);
            }
        }else{
            var content = `<a style="color:#93c900;font-size:17px;" data-toggle="modal" data-target="#modalSession" title="Se connecter ou S'inscrire" href="#" class="pull-right"><i style="color:#93c900;font-size:17px;" class="now-ui-icons users_single-02"></i>&nbsp;Ouvrir une session</a>`;
            $("#navUser").html(content);
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

/*Fonction dédiée à l'upload de l'image*/
function upload() {
    //On recupère cette balise
    var input = document.getElementById("imageProfile");


    //On lui attache un listen à son événement "onchange"
    //Afin d'écouter un eventuel changement de valeur qui interviendrai
    //si l'utilisateur valider la selection du fichier
    input.addEventListener('change', function () {

        console.log(input);

        //LES VARIABLES
        var formData = new FormData(), //L'objet formDATA qui sera soumit comme data dans AJAX
            file, //Le fichier
            reader, //Le lecteur de fichier qui servira à donner l'apperçu du fichier uploadé
            sortie = false; //L'objet de sortie


        //On vérifie si l'input file contient au moins un fichier
        if (input.files.length > 0) {

            file = input.files[0]; //On recupère le fichier contenu dans l'objet 'files' de l'input
            sortie = true; //On passe à true la condition de vérification
        }

        //Puis on ajoute le fichier à l'objet formData
        //Ce dernier aura comme key "files" et comme value "le fichier"
        formData.append('files_document', file, file.name);

        //On vérifie la sortie
        if (true) {

            //On exécute la requête ajax
            $.ajax({
                url: 'https://immo-jach-api.herokuapp.com/upload_image/users/clients',
                type: 'POST',
                data: formData,
                processData: false, // tell jQuery not to process the data
                contentType: false, // tell jQuery not to set contentType
                beforeSend: function () {
                },
                complete: function () {
                },
                success: function (data) {

                    //document.getElementById("containerProgress").setAttribute("style", "display: none");

                    Avatar(data);
                    if (!!file.type.match(/image.*/)) { //Ici on vérifie le type du fichier uploaded

                        if (window.FileReader) {
                            reader = new FileReader();
                            reader.onloadend = function (e) {
                                showUploadedImg(e.target.result, file);
                            };
                            reader.readAsDataURL(file);
                        }
                    } else {

                        if (window.FileReader) {
                            reader = new FileReader();
                            reader.onloadend = function (e) {


                            };
                            reader.readAsDataURL(file);
                        }
                    }
                },
                xhr: function () {

                    //$(".progress").show();
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();

                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function (evt) {

                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);

                            // update the Bootstrap progress bar with the new percentage
                            //$('#containerProgress .textProgress').text(percentComplete + ' %');
                            //document.getElementById("progress").setAttribute("style", "width: " + percentComplete + "%");

                            // once the upload reaches 100%, set the progress bar text to done
                            /*if (percentComplete === 100) {

                                setTimeout(function () {
                                    $("#containerProgress #progress").hide();
                                }, 4000)
                            }*/

                        }

                    }, false);

                    return xhr;
                }
            });
        }

        input.value = "";
    })


}

/*Pour l'affichage de l'image dans sa place*/
function showUploadedImg(source, file) {

    var imageSelect = document.getElementById("imgPrev");

    imageSelect.src = source;
    imageSelect.classList.add("img-responsive");
    imageSelect.setAttribute("style", "height : 9rem; width : 9rem;");
}

/*Récupère les données de l'upload de cet image*/
function Avatar(data) {

    dataAvatar = data.getObjet[0];
}

/*Cette fonction permet de finaliser l'upload avec les infos editées*/
function updateAvatar(user_id) {

    var submit = document.getElementById("submitAvatar");

    submit.addEventListener("click", (e) => {
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: "https://immo-jach-api.herokuapp.com/users/setImage",
            dataType: "json",
            data: {
                id_user: user_id,
                path: dataAvatar.path,
                name: dataAvatar.name,
                size: dataAvatar.size
            },
            success: function (data) {

                window.location.href = "/profile/" + user_id;
            }
        })

    })
}