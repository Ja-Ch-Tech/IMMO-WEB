var dataAvatar;
$(document).ready(function () {
    initUsers();
})

function initUsers() {
    login();
    getUserId(function (flag, user_id) {
        if (user_id) {
            userNavInfo(user_id);

            if (/profile/i.test(window.location.pathname.split("/")[1])) {
                getAvatar(user_id);
                if (/photo/i.test(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])) {
                    upload();
                    updateAvatar(user_id);
                }
                if (/ajouter/i.test(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])) {
                    //Rempli le select type
                    getTypeImmo(function (data) {
                        dynamiqueInput(data, "typeImmoAdd");
                    })

                    //Rempli le select mode
                    getAllMode(function (data) {
                        dynamiqueInput(data, "modeImmoAdd");
                    })

                    //Au submit du formulaire
                    $("#formAddImmo").on("submit", function (e) {
                        e.preventDefault();
                        addImmo(e, user_id);
                    })

                    setImage();
                }
                
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
            var image = () => {
                    return data.getObjet.image ? getHostAPI() + data.getObjet.image.lien : "/images/bg-img/1b3721afd0d0dbceebdb8bce26df9470-s120.jpg"; 
                    },
                contentProfileInfos = `<a style="color:#93c900;font-size:17px;" href="/profile/${data.getObjet._id}/informations" class="pull-right">
                                        <img class="img-thumbnail" style="width:40px;height:40px;border-radius:40px;" src="${image()}"/>&nbsp;<span>${data.getObjet.prenom}&nbsp;${data.getObjet.nom}</span>
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

            
            $.ajax({
                url: getHostAPI() + '/upload_image/users/clients',
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
            url: getHostAPI() + "/users/setImage",
            dataType: "json",
            data: {
                id_user: user_id,
                path: dataAvatar.path,
                name: dataAvatar.name,
                size: dataAvatar.size
            },
            success: function (data) {

                window.location.href = "/profile/" + user_id + "/photo";
            }
        })

    })
}

function getAvatar(user_id) {

    $.ajax({
        type: 'GET',
        url: `/api/infoForAnyUser/${user_id}`,
        dataType: "json",
        success: function (data) {
                console.log(data);
                var image = () => {
                    return data.getObjet.image ? getHostAPI() + data.getObjet.image.lien : "/images/bg-img/1b3721afd0d0dbceebdb8bce26df9470-s120.jpg"; 
                    };
                    
                if (/profile/i.test(window.location.pathname.split("/")[1])) {
                    var content = `<img class="img-thumbnail" src="${image()}" alt="">
                                    <p style="font-weight: bold;font-size: 18px;color: #333;margin:9px 0px; font-family: 'Poppins', sans-serif; text-transform: uppercase">${data.getObjet.login.username}</p>`;

                    $("#thisInfo").html(content);

                    if (/photo/i.test(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])) {
                        var contentAvatar = `<img class="img-thumbnail img-update-profile mt-50" src="${image()}" id="imgPrev" alt="">`;

                        $("#imageVisual").html(contentAvatar); 
                    }

                    if (/informations/i.test(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])) {
                        var obj = data.getObjet;
                        var formulaire = `

                    <div class="row">
                        <div class="col-md-12 mb-15">
                            <h2 style="font-family: calibri;color: #92c800">Informations de base</h2>
                        </div>
                        <div class="col-sm-12 col-lg-4 col-md-4 mb-10">
                            <label class="label-custom" for="username">Pseudonyme</label>
                            <input type="text" name="username" value="${obj.login.username}" class="form-control mb-20" placeholder="Pseudonyme" id="username">
                            
                            <!--
                            DANS CE SPAN QUE SERA AFFICHER LES ERREURS 
                            <span id="pseudoError" class="inputError pull-left">
                                <i class="now-ui-icons travel_info"></i> Le pseudo ne doit pas rester vide
                            </span> -->
                        </div>
                        <div class="col-sm-12 col-lg-4 col-md-4 mb-10">
                            <label class="label-custom" for="name">Nom</label>
                            <input type="text" name="nom" class="form-control mb-20" value="${obj.nom}" placeholder="Nom" id="name">

                            <!--
                            DANS CE SPAN QUE SERA AFFICHER LES ERREURS 
                            <span id="nomError" class="inputError pull-left">
                                <i class="now-ui-icons travel_info"></i> 
                            </span> -->
                        </div>
                        <div class="col-sm-12 col-lg-4 col-md-4 mb-10">
                            <label class="label-custom" for="prenom">Prénom</label>
                            <input type="text" name="prenom" class="form-control mb-20" placeholder="Prenom" value="${obj.prenom}" id="prenom">
                            <!--
                            DANS CE SPAN QUE SERA AFFICHER LES ERREURS 
                            <span id="prenomError" class="inputError pull-left">
                                <i class="now-ui-icons travel_info"></i> 
                            </span> -->
                        </div>
                        <div class="col-sm-12 col-lg-6 col-md-6 mb-10">
                            <label class="label-custom" for="phone">Téléphone</label>
                            <input type="text" name="telephone" class="form-control mb-20" placeholder="Numéro de Téléphone" value="${obj.contacts.length > 0 ? obj.contacts[obj.contacts.length - 1].telephone : ""}" id="phone">
                            <!--
                            DANS CE SPAN QUE SERA AFFICHER LES ERREURS 
                            <span id="phoneError" class="inputError pull-left">
                                <i class="now-ui-icons travel_info"></i> Le pseudo ne doit pas rester vide
                            </span> -->
                        </div>
                        <div class="col-sm-12 col-lg-6 col-md-6 mb-10">
                            <label class="label-custom" for="email">Adresse email</label>
                            <input type="email" name="email" class="form-control mb-20" placeholder="Adresse email" value="${obj.contacts.length > 0 ? obj.contacts[obj.contacts.length - 1].email : ""}" id="email">
                            <!--
                            DANS CE SPAN QUE SERA AFFICHER LES ERREURS 
                            <span id="emailError" class="inputError pull-left">
                                <i class="now-ui-icons travel_info"></i>
                            </span> -->
                        </div>
                        <div class="col-md-12 mb-15">
                            <h2 style="font-family: calibri;color: #92c800">Localisation</h2>
                        </div>
                        <div class="col-sm-12 col-lg-4 col-md-4 mb-10">
                            <label class="label-custom" for="ville">Ville</label>
                            <select name="ville" id="ville" class="form-control mb-20">
                                <option value="kinshasa">Kinshasa</option>
                                <option value="lubumbashi">lubumbashi</option>
                                <option value="Matadi">Matadi</option>
                                <option value="Goma">Goma</option>
                            </select>
                        </div>
                        <div class="col-sm-12 col-lg-4 col-md-4 mb-10">
                            <label class="label-custom" for="commune">Commune</label>
                            <input type="text" name="commune" class="form-control mb-20" placeholder="Commune" id="commune" value="${obj.adresse.commune ? obj.adresse.commune : ""}">
                        </div>
                        <!--
                            DANS CE SPAN QUE SERA AFFICHER LES ERREURS 
                            <span id="communeError" class="inputError pull-left">
                                <i class="now-ui-icons travel_info"></i>
                            </span> -->
                        <div class="col-sm-12 col-lg-4 col-md-4 mb-10">
                            <label class="label-custom" for="quartier">Quartier</label>
                            <input type="text" name="quartier" class="form-control mb-20" placeholder="quartier" id="quartier" value="${obj.adresse.quartier ? obj.adresse.quartier : ""}">
                        </div>
                        <!--
                            DANS CE SPAN QUE SERA AFFICHER LES ERREURS 
                            <span id="quartierError" class="inputError pull-left">
                                <i class="now-ui-icons travel_info"></i>
                            </span> -->
                        <div class="col-sm-12 col-lg-6 col-md-6 mb-10">
                            <label class="label-custom" for="avenue">Avenue</label>
                            <input type="text" name="avenue" class="form-control mb-20" placeholder="Avenue" id="avenue" value="${obj.adresse.avenue ? obj.adresse.avenue : ""}">
                        </div>
                        <!--
                            DANS CE SPAN QUE SERA AFFICHER LES ERREURS 
                            <span id="avenueError" class="inputError pull-left">
                                <i class="now-ui-icons travel_info"></i>
                            </span> -->
                        <div class="col-sm-12 col-lg-6 col-md-6 mb-10">
                            <label class="label-custom" for="numero_parcelle">Numéro parcelle</label>
                            <input type="number" name="numero" class="form-control mb-20" placeholder="numero parcelle" id="numero_parcelle" value="${obj.adresse.numero ? obj.adresse.numero : ""}">
                        </div>
                        
                        <div class="col-sm-12 col-lg-12 col-md-12 mb-10">
                            <label class="label-custom" for="reference">Ajoutez une reference</label>
                            <input type="text" name="reference" value="${obj.adresse.reference ? obj.adresse.reference : ""}" class="form-control mb-20" placeholder="reference" id="reference">
                        </div>
                        
                    </div>
                `;

                        $("#formInformation").html(formulaire);
                        updateInformation(user_id);
                    }
                }
                    
            
        }
    })
}

function updateInformation(userId) {
    document.getElementById("updateInformation").addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(e.target.elements);
        var objData = {};

        var sortieInput = 0;

        for (let index = 0; index < e.target.elements.length; index++) {
            sortieInput++;
            if (/input/i.test(e.target.elements[index].localName)) {
                objData[e.target.elements[index].name] = e.target.elements[index].value
            }

            if (sortieInput == e.target.elements.length) {
                $.ajax({
                    type: 'POST',
                    url: "/api/upProfile/" + userId,
                    dataType: "json",
                    data: objData,
                    success: function (data) {

                        console.log(data);
                        
                    }
                })
            }
        }
        
    })
}