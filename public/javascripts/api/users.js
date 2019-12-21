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
                //Dynamisation de la sidebar
                dynamicSideBar(user_id);
                if (/photo/i.test(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])) {
                    upload();
                    updateAvatar(user_id);
                }

                if (/publications/i.test(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])) {
                    getAllImmovableForOwner(user_id);
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

                if (/contacts/i.test(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])) {
                    getInterestImmo(user_id, 0)
                }

                if (/favoris/i.test(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])) {
                    getFavorisImmo(user_id, 1)
                }
                
            }

            //Verifie si le user est proprietaire
            infoOwner(user_id, function (data) {
                //Si proprietaire
                if (data.getEtat) {
                    $("#addImmoBtn").html(`<a href="/profile/${user_id}/publications/ajouter" title="Publiez un bien immobilier">Publiez votre bien </a>`)
                }else{
                    $("#addImmoBtn").html(`<a href="#" title="Publiez un bien immobilier">Publiez votre bien </a>`)

                }
            })
           
        }else{
            var content = `<a style="color:#93c900;font-size:17px;" data-toggle="modal" data-target="#modalSession" title="Se connecter ou S'inscrire" href="#" class="pull-right"><i style="color:#93c900;font-size:17px;" class="fa fa-user"></i>&nbsp;<span class="hidden-xs">Inscription/Connexion</span></a>`;
            $("#navUser").html(content);
            //Si le user n pas connecté
            $("#addImmoBtn").html(`<a href="#" data-toggle="modal" data-target="#modalSession" title="Publiez un bien immobilier">Publiez votre bien </a>`)
        }

    })
}

function infoOwner(id, callback) {
    $.ajax({
        type: 'GET',
        url: `/api/infoOwner/${id}`,
        dataType: "json",
        success: function (data) {
            
            callback(data)
        },
        error: function (err) {
            console.log(err)
        }
    });
}

/**
 * Dyanmise la sidebar du user connecté
 * @param {user_id} user_id, l'identifiant 
 */
function dynamicSideBar(user_id) {

    var active = function (href) {
            if (href == window.location.pathname) {
                return 'active';
            }else{
                return '';
            }
        },
        infoOwnerNav = function(user_id) {
            
            infoOwner(user_id, function (infos) {
                
                if (infos.getEtat) {
                    var li = `<li class="${active("/profile/" + user_id + "/publications")}"><a href="/profile/${user_id}/publications">Publications</a></li><li class="${active("/profile/" + user_id + "/publications/ajouter")}"><a href="/profile/${user_id}/publications/ajouter">Publier un bien</a></li>`;
                    $("#sideBar").append(li);
                }
            })
        },
        ul = ` <li title="Votre profile" class="${active("/profile/" + user_id + "/informations")}"><a href="/profile/${user_id}/informations">Profile</a></li>
              <li title="Photo de profile" class="${active("/profile/" + user_id + "/photo")}" ><a href="/profile/${user_id}/photo">Photo</a></li>
              <li title="Securisation du compte" class="${active("/profile/" + user_id + "/securite")}"><a href="/profile/${user_id}/securite">Securité</a></li>
              <li title="Immobiliers en favoris" class="${active("/profile/" + user_id + "/biens/favoris")}"><a href="/profile/${user_id}/biens/favoris">Favoris</a></li>
              <li title="Contacts immobiliers" class="${active("/profile/" + user_id + "/biens/contacts")}"><a href="/profile/${user_id}/biens/contacts">Contacts</a></li>`;
        $("#sideBar").html(ul);
        infoOwnerNav(user_id)
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
            beforeSend: function () {
                $("#btn-connect").text("VERIFICATION...");
            },
            success: function (data) {
                $("#btn-connect").text("CONNEXION");

                if (data.getEtat) {
                    window.location.href = "/";
                } else {
                    //Va bouger le modal
                    if (!($("#modalSession")[0].classList.contains("shake"))) {
                        $("#modalSession")[0].classList.add("animated")
                        $("#modalSession")[0].classList.add("shake")
                    }

                    //Retire les classes apres
                    setTimeout(function(){
                        $("#modalSession")[0].classList.remove("animated")
                        $("#modalSession")[0].classList.remove("shake")
                    },1000);
                    $("#errorMessage").html(`<div class="alert alert-danger">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                    <strong>Erreur!</strong> ${data.getMessage}, reessayez a nouveau
                  </div>`)
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
            var infoOwnerNav2 = function(user_id) {
            
                infoOwner(user_id, function (infos) {
                    
                    if (infos.getEtat) {
                        var li = `<a href="/profile/${user_id}/publications"><span class="zmdi zmdi-collection-item"></span>&nbsp;Mes publications</a>
                        <a href="/profile/${user_id}/publications/ajouter"><span class="zmdi zmdi-collection-plus"></span>&nbsp;Publier un bien</a>`;
                        $("#dropdownProfile").append(li);
                    }

                    $("#dropdownProfile").append(`<a href="/logout"><span class="zmdi zmdi-power"></span>&nbsp;Deconnexion</a>`);
                })
            }
            var contentProfileInfos = `<button class="dropbtn"><img style="width:40px;height:40px;border-radius:40px" class="img-thumbnail" src="${data.getObjet.image.srcFormat}" alt="${data.getObjet.image.srcFormat}"/>&nbsp;<span style="text-transform:uppercase" class="name_menu">${data.getObjet.prenom}&nbsp;${data.getObjet.nom}</span>&nbsp;<span class="zmdi zmdi-caret-down"></span></button>
            <div id="dropdownProfile" class="dropdown-content menu">
                <a href="/profile/${user_id}/informations"><span class="zmdi zmdi-account-o"></span>&nbsp;Profile</a>
                <a href="/profile/${user_id}/photo"><span class="zmdi zmdi-camera-add"></span>&nbsp;Photo</a>
                <a href="/profile/${user_id}/securite"><span class="zmdi zmdi-shield-security"></span>&nbsp;Securité</a>
                <a href="/profile/${user_id}/biens/favoris"><span class="zmdi zmdi-favorite-outline"></span>&nbsp;Favoris</a>
                <a href="/profile/${user_id}/biens/contacts"><span class="zmdi zmdi-accounts-list"></span>&nbsp;Contacts</a>
            </div>`;
            // $("#navAdditionalForUser").append(contentOtherNav);
            $("#navUser").append(contentProfileInfos);
            infoOwnerNav2(user_id);
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
        formData.append('image', file, file.name);

        //On vérifie la sortie
        if (true) {

            
            $.ajax({
                url: getHostAPI() + '/image-upload',
                type: 'POST',
                data: formData,
                processData: false, // tell jQuery not to process the data
                contentType: false, // tell jQuery not to set contentType
                beforeSend: function () {
                },
                complete: function () {
                },
                success: function (data) {
                    
                    if (data.flag) {
                        Avatar(data);
                        showUploadedImg();
                    } else {
                        swal(
                            {
                                title: "Error : Upload was not finished !",
                                type: "warning",
                                showCancelButton: true,
                                showConfirmButton: false,
                                cancelButtonText: "Recommencer..."
                            }
                        );
                    }
                    

                }
            });
        }

        input.value = "";
    })


}

/*Pour l'affichage de l'image dans sa place*/
function showUploadedImg() {

    var imageSelect = document.getElementById("imgPrev");

    imageSelect.src = dataAvatar.imageUrl;
    imageSelect.classList.add("img-responsive");
    imageSelect.setAttribute("style", "height : 9rem; width : 9rem;");
}

/*Récupère les données de l'upload de cet image*/
function Avatar(data) {

    dataAvatar = data;
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
                path: dataAvatar.imageUrl,
                name: "Avatar",
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
            
                var image = () => {
                    return data.getObjet.image ? getHostAPI() + data.getObjet.image.lien : "/images/bg-img/1b3721afd0d0dbceebdb8bce26df9470-s120.jpg"; 
                    };
                    
                if (/profile/i.test(window.location.pathname.split("/")[1])) {
                    var content = `<img class="img-thumbnail" src="${data.getObjet.image.srcFormat}" alt="${data.getObjet.image.name}">
                                    <p style="font-weight: bold;font-size: 18px;color: #333;margin:9px 0px; font-family: 'Poppins', sans-serif; text-transform: uppercase">${data.getObjet.login.username}</p>
                                    <a href="/logout"><i class="zmdi zmdi-power"></i>&nbsp;Deconnexion</a><hr>
                                    `;

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
                    beforeSend : function () {
                        $("#btnUpdateProfile")[0].innerHTML = "Modification en cours...";
                    },
                    success: function (data) {
                        swal(
                        {
                            title: "MODIFICATION PROFILE",
                            html: "Votre profile a été mis a jour",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "OK",
                            confirmButtonColor: "#DD6B55"

                        }
                    );
                    }
                })
            }
        }
        
    })
}

//Recupere les immo interessés
function getInterestImmo(userId, type) {
    $.ajax({
        type: 'GET',
        url: `/api/interestFavorisImmo/${userId}/${type}`,
        dataType: "json",
        success: function (data) {
                
            if (data.getEtat) {
                if (data.getObjet.length > 0) {
                    data.getObjet.map(immobilier => {
                         var rentOrSale = () => {
                             if (/location/i.test(immobilier.mode)) {
                                 return `A louer ${immobilier.prix} USD/mois`
                             } else {
                                 return `A vendre ${immobilier.prix} USD`
                             }
                         },
                         description = () => {
                             var description = immobilier.description;
                             if (description.length >= 200) {
                                 description = description.substr(0, 200) + "...";
                             }
                             return description;
                         },
                         adresseManager = () => {
                            if (/location/i.test(immobilier.mode)) {
                                return `${immobilier.adresse.avenue + " " + immobilier.adresse.numero}, ${immobilier.adresse.commune}`;
                            } else {
                                return `${immobilier.adresse.commune}`;
                            }
                        },
                         immobilierContent = `<a href="/immo/${immobilier._id}/details">
                         <div class="row resultatSearch wow fadeInUp" data-wow-delay="200ms">
                             <div style="padding: 0px;overflow: hidden;" class="col-md-4 col-xs-5">
                                 <img style="height: 200px" src="${immobilier.detailsImages[0].srcFormat}" alt="">
                             </div>
                             <div style="padding: 10px;" class="col-md-8">
                                 <div class="pull-right property-seller">
                                    <span style="color:#92c800;" class="pull-right"><i class="zmdi zmdi-time"></i>&nbsp;${customDate(immobilier.created_at)}</span>
                                     <p>Proprietaire:</p>
                                     <h6>${immobilier.prenomOwner}&nbsp;${immobilier.nomOwner}</h6>
                                 </div>
                                 <h4 class="text-uppercase">${immobilier.nomOwner}</h4>
                                 <h4>${rentOrSale()}</h4>
                                 <p style="margin-bottom: 16px;"><i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;${adresseManager()}</p>
                                 <p style="font-size: 13px;margin-bottom: 16px;">
                                     ${description()}
                                 </p>
                                 <hr style="margin-bottom: 0px;">
                                 <div class="property-info-area d-flex flex-wrap">
                                       ${immobilier.surface ? `<p>Superficie: <span>${immobilier.surface}m<sup>2</sup></span></p>` : ""}
                                       ${immobilier.nbrePiece ? `<p>Pièce: <span>${immobilier.nbrePiece}</span></p>` : ""}
                                       ${immobilier.nbreChambre ? `<p>Chambre: <span>${immobilier.nbreChambre}</span></p>` : ""}
                                       ${immobilier.nbreDouche ? `<p>Douche: <span>${immobilier.nbreDouche}</span></p>` : ""}
                                 </div>
                             </div>

                         </div></a>`;
                         $("#listContactImmo").append(immobilierContent);
                     
                    })
                }
            } else {
                var content = `<center>
                <span style="font-size:200px" class="zmdi zmdi-account-calendar icon-menu"></span><p>Votre liste d'immobiliers interessés est vide pour le moment</p>
                </center>`;

                $("#listContactImmo").append(content);
            }
            
        }
    })
}

//Recupere les immo en favoris
function getFavorisImmo(userId, type) {
    $.ajax({
        type: 'GET',
        url: `/api/interestFavorisImmo/${userId}/${type}`,
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                if (data.getObjet.length > 0) {
                    data.getObjet.map(immobilier => {
                         var rentOrSale = () => {
                             if (/location/i.test(immobilier.mode)) {
                                 return `A louer ${immobilier.prix} USD/mois`
                             } else {
                                 return `A vendre ${immobilier.prix} USD`
                             }
                         },
                         description = () => {
                             var description = immobilier.description;
                             if (description.length >= 200) {
                                 description = description.substr(0, 200) + "...";
                             }
                             return description;
                         },
                         adresseManager = () => {
                            if (/location/i.test(immobilier.mode)) {
                                return `${immobilier.adresse.avenue + " " + immobilier.adresse.numero}, ${immobilier.adresse.commune}`;
                            } else {
                                return `${immobilier.adresse.commune}`;
                            }
                        },
                         immobilierContent = `<a href="/immo/${immobilier._id}/details">
                         <div class="row resultatSearch wow fadeInUp" data-wow-delay="200ms">
                             <div style="padding: 0px;overflow: hidden;" class="col-md-4 col-xs-5">
                                 <img style="height: 200px" src="${immobilier.detailsImages[0].srcFormat}" alt="">
                             </div>
                             <div style="padding: 10px;" class="col-md-8">
                                 <div class="pull-right property-seller">
                                    <span style="color:#92c800;" class="pull-right"><i class="zmdi zmdi-time"></i>&nbsp;${customDate(immobilier.created_at)}</span>
                                     <p>Proprietaire:</p>
                                     <h6>${immobilier.prenomOwner}&nbsp;${immobilier.nomOwner}</h6>
                                 </div>
                                 <h4 class="text-uppercase">${immobilier.nomOwner}</h4>
                                 <h4>${rentOrSale()}</h4>
                                 <p style="margin-bottom: 16px;"><i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;${adresseManager()}</p>
                                 <p style="font-size: 13px;margin-bottom: 16px;">
                                     ${description()}
                                 </p>
                                 <hr style="margin-bottom: 0px;">
                                 <div class="property-info-area d-flex flex-wrap">
                                       ${immobilier.surface ? `<p>Superficie: <span>${immobilier.surface}m<sup>2</sup></span></p>` : ""}
                                       ${immobilier.nbrePiece ? `<p>Pièce: <span>${immobilier.nbrePiece}</span></p>` : ""}
                                       ${immobilier.nbreChambre ? `<p>Chambre: <span>${immobilier.nbreChambre}</span></p>` : ""}
                                       ${immobilier.nbreDouche ? `<p>Douche: <span>${immobilier.nbreDouche}</span></p>` : ""}
                                 </div>
                             </div>

                         </div></a>`;
                         $("#listFavorisForUser").append(immobilierContent);
                     
                    })
                }
            } else {
                var content = `<center>
                <span style="font-size:200px" class="zmdi zmdi-favorite-outline icon-menu"></span><p>Votre liste des favoris est vide, visitez plus d'immobiliers pour ajouter aux favoris</p>
                </center>`;

                $("#listFavorisForUser").append(content);
            }
            
        }
    })
}