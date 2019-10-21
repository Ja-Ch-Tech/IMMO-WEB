var typeProp, newImmo, details, images = [], dataAvatarImmo;

$(document).ready(function () {
    initImmo();
})

function initImmo() {
    if (window.location.pathname == "/") {
        typeProp = $("#typeProperties");
        newImmo = $("#newImmo");
        getStatType();
        getNewImmobilier();
    }
    if (/vente/i.test(window.location.pathname.split("/")[2]) && /immo/i.test(window.location.pathname.split("/")[1]) && /liste/i.test(window.location.pathname.split("/")[4])) {

        var mode_id = window.location.pathname.split("/")[3];
        getImmoByMode(mode_id, "immoVente");
    }
    if (/location/i.test(window.location.pathname.split("/")[2]) && /immo/i.test(window.location.pathname.split("/")[1]) && /liste/i.test(window.location.pathname.split("/")[4])) {

        var mode_id = window.location.pathname.split("/")[3];
        getImmoByMode(mode_id, "immoLocation");
    }
    if (/details|detail/i.test(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])) {
        details = $("#detailThis");
        getDetailsImmobilier(window.location.pathname.split("/")[window.location.pathname.split("/").length - 2])
    }
    if (/immo/i.test(window.location.pathname.split("/")[1]) && /type/i.test(window.location.pathname.split("/")[2]) && /liste/i.test(window.location.pathname.split("/")[4])) {

        var type_id = window.location.pathname.split("/")[3];
        getImmoByType(type_id)
    }
}

function getStatType() {
    $.ajax({
        type: 'GET',
        url: '/api/statType',
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                if (data.getObjet.length > 0) {
                    var contentHead = `<div class="row" id="elementProp">
                                    <div class="col-12">
                                        <div class="section-heading wow fadeInUp" data-wow-delay="200ms">
                                            <h2>Trouver par <span>type de biens</span></h2>
                                            <p></p>
                                        </div>
                                    </div>

                                </div>`;
                    typeProp.append(contentHead);

                    data.getObjet.map(prop => {
                        var contentBody = `<div class="col-12 col-md-3">
                                            <div class="single-categories-property-area bg-gradient-overlay wow fadeInUp" data-wow-delay="200ms">
                                                <div class="property-thumb">
                                                    <a href="#"><img src="/images/bg-img/9.jpg" alt=""></a>
                                                </div>
                                                <!-- Title -->
                                                <a class="categories-title" href="#">${customProp(prop.nbreProp ? prop.nbreProp : 0)} </a>
                                                <!-- Property Name and Price -->
                                                <div class="property-name-price-text">
                                                    <a href="/type/${prop._id}">${prop.intitule}</a>
                                                </div>
                                            </div>
                                        </div>`;

                        $("#elementProp").append(contentBody)
                    })
                }
            }

        }
    });
}

function customProp(nbre) {
    return nbre + " Propriété" + (+nbre > 1 ? "s" : "");
}

function getNewImmobilier() {
    $.ajax({
        type: 'GET',
        url: '/api/new',
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                if (data.getObjet.length > 0) {
                    var contentHeadAndFooter = `<div class="row">
                                    <div class="col-12">
                                        <div class="section-heading wow fadeInUp" data-wow-delay="200ms">
                                            <h2>Dernieres <span>annonces</span></h2>
                                        </div>
                                    </div>

                                    <div id="elementNewImmo" class="col-12 row">
                                        
                                    </div>
                                    <div class="row">
                                        <div class=" col-12 col-md-6 col-lg-12">
                                            <button class="btn rehomes-btn pull-right">Chargez plus de biens <i class="now-ui-icons arrows-1_minimal-right"></i></button>
                                        </div>
                                    </div>`;
                    newImmo.html(contentHeadAndFooter);

                    //Tri côté client
                    data.getObjet.sort((element1, element2) => {
                        if (element1.created_at > element2.created_at) {
                            return -1;
                        }

                        return 1;
                    });
                    data.getObjet.map(element => {
                        console.log(element);

                        var rentOrSale = () => {
                            if (/location/i.test(element.mode)) {
                                return `<p class="badge-rent">A louer</p>`
                            } else {
                                return `<p class="badge-sale">A vendre</p>`
                            }
                        },
                            contentBody = `<div class="col-12 col-md-6 col-lg-4">
                  <div class="single-property-area wow fadeInUp" data-wow-delay="200ms">
                      <!-- Property Thumb -->
                      <div class="property-thumb">
                          <a href="/immo/${element._id}/details"><img src="/images/bg-img/1.jpg" alt=""></a>
                      </div>

                      <!-- Property Description -->
                      <div class="property-desc-area">
                          <!-- Property Title & Seller -->
                          <div class="property-title-seller d-flex justify-content-between">
                              <!-- Title -->
                              <div class="property-title">
                                  <h4 class="text-uppercase">${element.type}</h4>
                                  <p><i class="fa fa-map-marker" aria-hidden="true"></i> ${element.adresse.avenue + " " + element.adresse.numero}, ${element.adresse.commune}</p>
                              </div>
                              <!-- Seller -->
                              <div class="property-seller">
                                  <p>Propriétaire:</p>
                                  <h6>${element.prenomOwner + " " + element.nomOwner}</h6>
                              </div>
                          </div>
                          <!-- Property Info -->
                          <div class="property-info-area d-flex flex-wrap">
                              ${element.surface ? `<p>Superficie: <span>${element.surface}m<sup>2</sup></span></p>` : ""}
                              ${element.nbrePiece ? `<p>Pièce: <span>${element.nbrePiece}</span></p>` : ""}
                              ${element.nbreChambre ? `<p>Chambre: <span>${element.nbreChambre}</span></p>` : ""}
                              ${element.nbreDouche ? `<p>Douche: <span>${element.nbreDouche}</span></p>` : ""}
                          </div>
                      </div>

                      <!-- Property Price -->
                      <div class="property-price">
                            ${rentOrSale()}
                            <p class="price">$${element.prix}</p>
                      </div>
                  </div>
              </div>`;
                        $("#elementNewImmo").append(contentBody);
                    })
                }
            }
        }
    });
}

//Recupere les immo par mode
function getImmoByMode(mode_id, bloc_id) {
    $.ajax({
        type: 'GET',
        url: '/api/immo_by_mode/' + mode_id,
        dataType: "json",
        beforeSend: function () {

        },
        success: function (data) {
            if (data.getEtat) {
                if (data.getObjet.length > 0) {

                    data.getObjet.map(element => {
                        var rentOrSale = () => {
                            if (/location/i.test(element.mode)) {
                                return `<p class="badge-rent">A louer</p>`
                            } else {
                                return `<p class="badge-sale">A vendre</p>`
                            }
                        },
                            contentImmo = `<div class="col-12 col-md-6 col-lg-4">
                                              <a href="/immo/${element._id}/details">
                                                <div class="single-property-area wow fadeInUp" data-wow-delay="200ms">
                                                    <!-- Property Thumb -->
                                                    <div class="property-thumb">
                                                        <img src="/images/bg-img/1.jpg" alt="">
                                                    </div>

                                                    <!-- Property Description -->
                                                    <div class="property-desc-area">
                                                        <!-- Property Title & Seller -->
                                                        <div class="property-title-seller d-flex justify-content-between">
                                                            <!-- Title -->
                                                            <div class="property-title">
                                                                <h4 class="text-uppercase">${element.type}</h4>
                                                                <p><i class="fa fa-map-marker" aria-hidden="true"></i> ${element.adresse.avenue + " " + element.adresse.numero}, ${element.adresse.commune}</p>
                                                            </div>
                                                            <!-- Seller -->
                                                            <div class="property-seller">
                                                                <p>Propriétaire:</p>
                                                                <h6>${element.prenomOwner + " " + element.nomOwner}</h6>
                                                            </div>
                                                        </div>
                                                        <!-- Property Info -->
                                                        <div class="property-info-area d-flex flex-wrap">
                                                            ${element.surface ? `<p>Superficie: <span>${element.surface}m<sup>2</sup></span></p>` : ""}
                                                            ${element.nbrePiece ? `<p>Pièce: <span>${element.nbrePiece}</span></p>` : ""}
                                                            ${element.nbreChambre ? `<p>Chambre: <span>${element.nbreChambre}</span></p>` : ""}
                                                            ${element.nbreDouche ? `<p>Douche: <span>${element.nbreDouche}</span></p>` : ""}
                                                        </div>
                                                    </div>

                                                    <!-- Property Price -->
                                                    <div class="property-price">
                                                        ${rentOrSale()}
                                                        <p class="price">$${element.prix}${/location/i.test(element.mode) ? '/mois' : ''}</p>
                                                    </div>
                                                </div>
                                              </a>
                                            </div>`;
                        $("#" + bloc_id).append(contentImmo);
                    })

                } else {


                }
            } else {

            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function getDetailsImmobilier(id) {
    //alert(id)
    getUserId((isMatch, result) => {
        $.ajax({
            type: 'GET',
            url: `/api/details/${id}`,
            dataType: "json",
            beforeSend: function () {

            },
            success: function (datas) {
                if (datas.getEtat) {
                    console.log(datas.getObjet);
                    var obj = datas.getObjet;
                    interestOrNot = () => {

                        if (isMatch) {
                            return `<div class="mt-3">
                                        <a class="btn rehomes-btn mt-10" href="#" onclick="viewContact('${obj.id_owner}')">Je veux le contacter</a>
                                    </div>`
                        } else {
                            return `<div class="mt-3">
                                        <a class="btn rehomes-btn mt-10" href="#">Je veux le contacter</a>
                                    </div>`
                        }
                    },
                        content = `<div class="properties-slide">
                
                                <div id="property-thumb-silde" class="carousel slide wow fadeInUp" data-wow-delay="200ms" data-ride="carousel">
                                    <ol class="carousel-indicators">
                                        <li data-target="#property-thumb-silde" data-slide-to="0" class="active" style="background-image: url(/images/bg-img/64.jpg);"></li>
                                        <li data-target="#property-thumb-silde" data-slide-to="1" style="background-image: url(/images/bg-img/65.jpg);"></li>
                                        <li data-target="#property-thumb-silde" data-slide-to="2" style="background-image: url(/images/bg-img/66.jpg);"></li>
                                        <li data-target="#property-thumb-silde" data-slide-to="3" style="background-image: url(/images/bg-img/67.jpg);"></li>
                                    </ol>

                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <img src="/images/bg-img/64.jpg" class="d-block w-100" alt="...">
                                        </div>
                                        <div class="carousel-item">
                                            <img src="/images/bg-img/65.jpg" class="d-block w-100" alt="...">
                                        </div>
                                        <div class="carousel-item">
                                            <img src="/images/bg-img/66.jpg" class="d-block w-100" alt="...">
                                        </div>
                                        <div class="carousel-item">
                                            <img src="/images/bg-img/67.jpg" class="d-block w-100" alt="...">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Properties Content Area -->
                            <div class="properties-content-area wow fadeInUp" data-wow-delay="200ms">
                                <div class="properties-content-info">
                                    <h2>${obj.type} à ${obj.adresse.commune}</h2>
                                    <div class="properties-location">
                                        <p><i class="fa fa-map-marker" aria-hidden="true"></i> ${obj.adresse.numero + " " + obj.adresse.avenue + ", C/" + obj.adresse.commune + ", Congo"}</p>
                                        <p><i class="fa fa-map-marker" aria-hidden="true"></i> ${obj.type}</p>
                                    </div>
                                    <h4 class="properties-rate">$${obj.prix} <span>${!/Vente|ventes/i.test(obj.mode) ? `/ month` : ``}</span></h4>
                                    <p>${obj.description}</p>
                                    <!-- Properties Info -->
                                    <div class="properties-info">
                                        ${obj.surface ? `<p>Superficie: <span>${obj.surface}m<sup>2</sup></span></p>` : ""}
                                        ${obj.nbrePiece ? `<p>Pièce: <span>${obj.nbrePiece}</span></p>` : ""}
                                        ${obj.nbreChambre ? `<p>Chambre: <span>${obj.nbreChambre}</span></p>` : ""}
                                        ${obj.nbreDouche ? `<p>Douche: <span>${obj.nbreDouche}</span></p>` : ""}
                                    </div>
                                    
                                    ${interestOrNot()}
                                </div>
                            </div>`;

                    details.append(content);
                }
            }
        })
    })
}

function viewContact(id) {
    getUserId((isMatch, result) => {
        $.ajax({
            type: 'POST',
            url: "/api/interessant",
            dataType: "json",
            data: {
                "id_user": result,
                "id_owner": id
            },
            success: function (data) {

                var modal = document.getElementById("modalForContactUs"),
                    obj = data.getObjet;

                var allContacts = () => {
                    if (obj.contacts.length > 0) {
                        obj.contacts.map(item => {
                            return `${item.telephone ? `<font>N°Téléphone : <span>${item.telephone}</span></font>` : ""}
                                            ${item.email ? `<font>Adresse e-mail : <span>${item.email}</span></font>` : ""}`;
                        })
                    } else {
                        return "";
                    }
                },
                    content = ` <div class="cardThis">
                                    <font class="closeModal" onclick="closeModal()"><i class="fa fa-times-circle"></i></font>
                                    <div class="avatar-owner">
                                        <img src="/images/bg-img/house-3664320_1920.jpg" alt="Image owner">
                                    </div>
                                    <div class="info-owner">
                                    <h4 class="noms">${obj.prenom + " " + obj.nom}</h4>
                                    <p class="adresse"><i class="fa fa-map-marker" aria-hidden="true"></i> ${obj.adresse.numero + " " + obj.adresse.avenue + ", C/" + obj.adresse.commune + ", Congo"}</p>

                                    <div class="autresContacts">
                                        ${allContacts()}
                                    </div>

                                    <div class="footerContact">
                                        <p>Powered by&nbsp;<span>Ja'Ch Technologies</span></p>
                                    </div>
                                    </div>
                                </div>`;

                modal.innerHTML = content;
                modal.classList.remove("d-none");

            }
        });
    })
}

function closeModal() {
    var modal = document.getElementById("modalForContactUs");

    modal.classList.add("d-none");

}

/**
 * Permet de recuperer les immo par type
 */
function getImmoByType(type_id) {
    $.ajax({
        type: 'GET',
        url: '/api/getAllForType/' + type_id,
        dataType: "json",
        beforeSend: function () {

        },
        success: function (data) {
            if (data.getEtat) {
                var immoParTypeContent = `<div class="row">
                        <div class="col-12">
                            <div class="section-heading wow fadeInUp" data-wow-delay="200ms">
                                <h2>Bien de type <span id="typeName">${data.getObjet.categorie}</span></h2>
                                <p>These are the best deals and deals. All in New York City and nearby area</p>
                            </div>
                        </div>
                    </div>
                    <div id="immoType" class="row">
                    </div>`;
                $("#immoParTypeBloc").append(immoParTypeContent);
                if (data.getObjet.immobiliers.length > 0) {

                    data.getObjet.immobiliers.map(element => {
                        var rentOrSale = () => {
                            if (/location/i.test(element.mode)) {
                                return `<p class="badge-rent">A louer</p>`
                            } else {
                                return `<p class="badge-sale">A vendre</p>`
                            }
                        },
                            contentImmo = `<div class="col-12 col-md-6 col-lg-4">
                                              <a href="/immo/${element._id}/details">
                                                <div class="single-property-area wow fadeInUp" data-wow-delay="200ms">
                                                    <!-- Property Thumb -->
                                                    <div class="property-thumb">
                                                        <img src="/images/bg-img/1.jpg" alt="">
                                                    </div>

                                                    <!-- Property Description -->
                                                    <div class="property-desc-area">
                                                        <!-- Property Title & Seller -->
                                                        <div class="property-title-seller d-flex justify-content-between">
                                                            <!-- Title -->
                                                            <div class="property-title">
                                                                <h4 class="text-uppercase">${data.getObjet.categorie}</h4>
                                                                <p><i class="fa fa-map-marker" aria-hidden="true"></i> ${element.adresse.avenue + " " + element.adresse.numero}, ${element.adresse.commune}</p>
                                                            </div>
                                                            <!-- Seller -->
                                                            <div class="property-seller">
                                                                <p>Propriétaire:</p>
                                                                <h6>${element.prenomOwner + " " + element.nomOwner}</h6>
                                                            </div>
                                                        </div>
                                                        <!-- Property Info -->
                                                        <div class="property-info-area d-flex flex-wrap">
                                                            ${element.surface ? `<p>Superficie: <span>${element.surface}m<sup>2</sup></span></p>` : ""}
                                                            ${element.nbrePiece ? `<p>Pièce: <span>${element.nbrePiece}</span></p>` : ""}
                                                            ${element.nbreChambre ? `<p>Chambre: <span>${element.nbreChambre}</span></p>` : ""}
                                                            ${element.nbreDouche ? `<p>Douche: <span>${element.nbreDouche}</span></p>` : ""}
                                                        </div>
                                                    </div>

                                                    <!-- Property Price -->
                                                    <div class="property-price">
                                                        ${rentOrSale()}
                                                        <p class="price">$${element.prix}${/location/i.test(element.mode) ? '/mois' : ''}</p>
                                                    </div>
                                                </div>
                                              </a>
                                            </div>`;
                        $("#immoType").append(contentImmo);
                    })

                } else {


                }
            } else {

            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

/* Permet d'ajouter un immo */

function addImmo(e, user_id) {
    var inputs = e.target.elements,
        objData = {},
        sortieInput = 0;
    for (let index = 0; index < inputs.length; index++) {
        sortieInput++;
        if (/input/i.test(e.target.elements[index].localName)) {
            objData[inputs[index].name] = inputs[index].value;
        }

        if (/textarea/i.test(e.target.elements[index].localName)) {
            objData[inputs[index].name] = inputs[index].value;
        }

        if (/select/i.test(e.target.elements[index].localName)) {
            objData[inputs[index].name] = inputs[index].options[inputs[index].selectedIndex].value;
        }

        if (sortieInput == inputs.length) {
            $.ajax({
                type: 'POST',
                url: "/api/addImmob",
                dataType: "json",
                data: objData,
                success: function (data) {

                    if (data.getEtat) {
                        $.ajax({
                            type: 'POST',
                            url: `${getHostAPI()}/immobilier/setImages`,
                            dataType: "json",
                            data: {
                                "id_immo": data.getObjet._id,
                                "images": localStorage.getItem("images")
                            },
                            success: function (data) {
                                
                                if (data.getEtat) {
                                    localStorage.removeItem("images")
                                }

                            }
                        });
                    }

                }
            });
        }
    }
}

function setImage() {
    //On recupère cette balise
    var input = document.getElementById("imageImmo");


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
        formData.append('files_document', file, file.name);

        //On vérifie la sortie
        if (true) {

            var nameImage = document.getElementById("nameImage");

            if (nameImage && nameImage.value.trim(" ")) {
                $.ajax({
                    url: getHostAPI() + '/upload_image/immobiliers/' + nameImage.value.trim(" "),
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

                        AvatarImmo(data);
                        if (!!file.type.match(/image.*/)) { //Ici on vérifie le type du fichier uploaded

                            if (window.FileReader) {
                                reader = new FileReader();
                                reader.onloadend = function (e) {
                                    showUploadedImgImmo(e.target.result, nameImage.value);
                                    $.ajax({
                                        type: 'POST',
                                        url: `${getHostAPI()}/media/create`,
                                        data: {
                                            name: data.getObjet[0].name,
                                            path: data.getObjet[0].path,
                                            size: data.getObjet[0].size,
                                        },
                                        dataType: "json",
                                        success: function (data) {

                                            var images = JSON.parse(localStorage.getItem("images"));

                                            if (images) {

                                                images.push({
                                                    "lien_images": data.getObjet._id,
                                                    "name": nameImage.value
                                                })

                                                localStorage.setItem("images", JSON.stringify(images));
                                            } else {

                                                var images = [];
                                                images.push({
                                                    "lien_images": data.getObjet._id,
                                                    "name": nameImage.value
                                                })

                                                localStorage.setItem("images", JSON.stringify(images))
                                            }

                                            nameImage.value = "";
                                            nameImage.focus();

                                        }
                                    });
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

                            }

                        }, false);

                        return xhr;
                    }
                });
            } else {
                nameImage.focus();
            }

        }

        input.value = "";
    })

}

/*Récupère les données de l'upload de cet image*/
function AvatarImmo(data) {

    dataAvatarImmo = data.getObjet[0];
}

/*Pour l'affichage de l'image dans sa place*/
function showUploadedImgImmo(source, title) {
    var div = document.getElementById("minusImage");

    var img = document.createElement("img");

    img.src = source;
    img.title = title;
    img.setAttribute("style", "height: 3rem; width: 3rem");

    div.append(img);
}