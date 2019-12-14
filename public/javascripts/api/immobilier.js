var typeProp, newImmo, details, images = [],
    dataAvatarImmo, errorServer, noFound;

$(document).ready(function () {
    initImmo();
    errorServer = `
    <div class="MainGraphic">
        <svg class="Cog" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M29.18 19.07c-1.678-2.908-.668-6.634 2.256-8.328L28.29 5.295c-.897.527-1.942.83-3.057.83-3.36 0-6.085-2.743-6.085-6.126h-6.29c.01 1.043-.25 2.102-.81 3.07-1.68 2.907-5.41 3.896-8.34 2.21L.566 10.727c.905.515 1.69 1.268 2.246 2.234 1.677 2.904.673 6.624-2.24 8.32l3.145 5.447c.895-.522 1.935-.82 3.044-.82 3.35 0 6.066 2.725 6.083 6.092h6.29c-.004-1.035.258-2.08.81-3.04 1.676-2.902 5.4-3.893 8.325-2.218l3.145-5.447c-.9-.515-1.678-1.266-2.232-2.226zM16 22.48c-3.578 0-6.48-2.902-6.48-6.48S12.423 9.52 16 9.52c3.578 0 6.48 2.902 6.48 6.48s-2.902 6.48-6.48 6.48z"/></svg>
    </div>

      </svg>
     <h1 class="MainTitle">
          An error has occurred
        </h1>
      <p class="Main Description">
        Server is currently under high load - please hit 'reload' on your browser in a minute to try again
      </p>`;
    noFound = `<div id="notfound">
        <div class="notfound">
            <h2>AUCUN IMMOBILIER POUR LE MOMENT</h2>
            <p>En cas de publication vous recevrez une notification ou soit contacter nous au <b>+24389999999</b> pour plus de details</p>
            <a href="javascript:history.back()">Retour en arriere</a>
        </div>
    </div>`;
})

function initImmo() {
    if (window.location.pathname == "/") {
        typeProp = $("#typeProperties");
        newImmo = $("#newImmo");
        getStatType();
        getNewImmobilier();

        // Recherche, remplissage des inputs
        getTypeImmo(function (data) {
            dynamiqueInput(data, "typesSearch");
        })

        //Rempli le select mode
        getAllMode(function (data) {
            dynamiqueInput(data, "modeSearch");
        })

        //A la soumission du formulaire d'accueil
        storageKeys("postSearch", function (data) {
            window.location.href = "/immo/recherche";
        });
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

    if (/immo/i.test(window.location.pathname.split("/")[1]) && /recherche/i.test(window.location.pathname.split("/")[2])) {
        searchImmo();
        //Gere le select mode
        manageModeSearch();
        //Gere le select type
        manageTypeSearch();
        //Gere les autres inputs text
        inputSearch();

        //Lorsqu'on soumet le formulaire se trouvant sur la page de recherche
        storageKeys("postOnSearchPage", function (data) {
            searchImmo();
        })
    }

    if (/immo/i.test(window.location.pathname.split("/")[1]) && /voir-tous-les-immo/i.test(window.location.pathname.split("/")[2])) {
        //Initialise les inputs
        //Gere le select mode
        manageModeSearch();
        //Gere le select type
        manageTypeSearch();

        //Lorsqu'on filtre 
        //Lorsqu'on soumet le formulaire se trouvant sur la page de recherche
        storageKeys("postOnSearchPage", function (data) {
            searchImmo();
        })
        //Recupere tous les immobiliers (Lorsqu'on recharge la page)
        $.ajax({
            type: 'GET',
            url: "/api/all",
            dataType: "json",
            beforeSend: function () {
                //Loader de la recherche
                $("#searchContent").html('<div class="loader08"></div>');
            },
            success: function (data) {
                console.log(data);
                $("#searchContent").html('');
                if (data.getEtat) {

                    var sortieImmo = 0,
                        textSearch = function () {
                            if (data.getObjet.length == 0) {
                                return `<span style="color: #2a303b">Aucun</span> immobilier trouvé`;
                            } else if (data.getObjet.length == 1) {
                                return `<span style="color: #2a303b">un</span> immobilier trouvé`;
                            } else if (data.getObjet.length > 1) {
                                return `<span style="color: #8bbe00">${data.getObjet.length}</span> immobiliers sur ndakubizz`;
                            } else {
                                `Une erreur est survenue, veuillez reessayer avec des bonnes données`;
                            }
                        }
                    content = `<div class="col-12 col-md-12 col-lg-12">
                                        <h4 style="font-family: 'Poppins', sans-serif !important;margin-bottom:20px;">${textSearch()}</h4>
                                    </div>
                                    <div id="searchImmoContent" class="col-12 col-md-12 col-lg-12">
                                        
                                    </div>`;
                    $("#searchContent").html(content);

                    //Ajout des immobilier
                    data.getObjet.map(immobilier => {
                        sortieImmo++;
                        var rentOrSale = () => {
                            if (/location/i.test(immobilier.mode)) {
                                return `a louer ${immobilier.prix} USD/mois`
                            } else {
                                return `a vendre ${immobilier.prix} USD`
                            }
                        },
                            description = () => {
                                var description = immobilier.description;
                                if (description.length >= 200) {
                                    description = description.substr(0, 200) + "...";
                                }
                                return description;
                            }
                        immobilierContent = `<a href="/immo/${immobilier._id}/details">
                            <div class="row resultatSearch wow fadeInUp" data-wow-delay="200ms">
                                <div style="padding: 0px;overflow: hidden;" class="col-md-4 col-xs-5">
                                    <img style="height: 200px" src="${immobilier.detailsImages[0].srcFormat}" alt="">
                                </div>
                                <div style="padding: 10px;" class="col-md-8">
                                    <div class="pull-right property-seller">
                                        <p>Proprietaire:</p>
                                        <h6>${immobilier.prenomOwner}&nbsp;${immobilier.nomOwner}</h6>
                                    </div>
                                    <h4 class="text-uppercase">${immobilier.nomOwner}</h4>
                                    <h4>${immobilier.type} ${rentOrSale()}</h4>
                                    <p style="margin-bottom: 16px;"><i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;${immobilier.adresse.avenue + " " + immobilier.adresse.numero}, ${immobilier.adresse.commune}</p>
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
                        $("#searchImmoContent").append(immobilierContent);

                    })
                } else {
                    $("#searchContent").html(`<div id="notfound">
                        <div class="notfound">
                            <h2>AUCUN RESULTAT POUR VOTRE REHCERCHE</h2>
                            <p>En cas de publication vous recevrez une notification ou soit contacter nous au <b>+243974841783</b> ou à notre adresse email <b>contact@ndakubizz.com</b> pour plus de details</p>
                            <a href="javascript:history.back()">Retour en arriere</a>
                        </div>
                    </div>`);
                }

            }, error: function (err) {
                $("#searchContent").html('');
                $("#searchContent")[0].append(errorServer);
            }
        });
    }

}
// Lance la recherche des immobiliers
function searchImmo() {
    var datas = {
        "mode": sessionStorage.getItem('mode') ? sessionStorage.getItem('mode') : null,
        "type": sessionStorage.getItem('type') ? sessionStorage.getItem('type') : null,
        "commune": sessionStorage.getItem('commune') ? sessionStorage.getItem('commune') : null,
        "nbrePiece": sessionStorage.getItem('nbrePiece') ? sessionStorage.getItem('nbrePiece') : null,
        "montantMin": sessionStorage.getItem('montantMin') ? sessionStorage.getItem('montantMin') : null,
        "montantMax": sessionStorage.getItem('montantMax') ? sessionStorage.getItem('montantMax') : null,
        "nbreChambre": sessionStorage.getItem('nbreChambre') ? sessionStorage.getItem('nbreChambre') : null
    }
    $.ajax({
        type: 'POST',
        url: "/api/searchImmo",
        dataType: "json",
        data: datas,
        beforeSend: function () {
            //Loader de la recherche
            $("#searchContent").html('<div class="loader08"></div>');
        },
        success: function (data) {
            $("#searchContent").html('');
            if (data.getEtat) {
                var sortieImmo = 0,
                    textSearch = function () {
                        if (data.getObjet.immobiliers.length == 0) {
                            return `<span style="color: #2a303b">Aucun</span> immobilier trouvé pour votre recherche`;
                        } else if (data.getObjet.immobiliers.length == 1) {
                            return `<span style="color: #2a303b">Un</span> immobilier trouvé pour votre recherche`;
                        } else if (data.getObjet.immobiliers.length > 1) {
                            return `<span style="color: #2a303b">${data.getObjet.immobiliers.length}</span> immobiliers trouvés pour votre recherche`;
                        } else {
                            `Une erreur est survenue, veuillez réessayer avec des bonnes données`;
                        }
                    }
                content = `<div class="col-12 col-md-12 col-lg-12">
                                    <h4 style="font-family: 'Poppins', sans-serif !important;margin-bottom:20px;">${textSearch()}</h4>
                                </div>
                                <div id="searchImmoContent" class="col-12 col-md-12 col-lg-12">
                                    
                                </div>`;
                $("#searchContent").html(content);

                //Ajout des immobilier
                data.getObjet.immobiliers.map(immobilier => {

                    sortieImmo++;
                    var rentOrSale = () => {
                        if (/location/i.test(immobilier.mode)) {
                            return `a louer ${immobilier.prix} $/mois`
                        } else {
                            return `a vendre ${immobilier.prix} $`
                        }
                    },
                        description = () => {
                            var description = immobilier.description;
                            if (description.length >= 200) {
                                description = description.substr(0, 200) + "...";
                            }
                            return description;
                        }
                    immobilierContent = `<a href="/immo/${immobilier._id}/details">
                        <div class="row resultatSearch wow fadeInUp" data-wow-delay="200ms">
                            <div style="padding: 0px;overflow: hidden;" class="col-md-4 col-xs-5" title="${immobilier.detailsImages[immobilier.detailsImages.length - 1].intitule}">
                                <img style="height: 100%" src="${immobilier.detailsImages[immobilier.detailsImages.length - 1].srcFormat}" alt="${immobilier.detailsImages[immobilier.detailsImages.length - 1].intitule}">
                            </div>
                            <div style="padding: 10px;" class="col-md-8">
                                <div class="pull-right property-seller">
                                    <p>Proprietaire:</p>
                                    <h6>${immobilier.prenomOwner}&nbsp;${immobilier.nomOwner}</h6>
                                </div>
                                <h4 class="text-uppercase">${immobilier.nomOwner}</h4>
                                <h4>${immobilier.type} ${rentOrSale()}</h4>
                                <p style="margin-bottom: 16px;"><i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;${immobilier.adresse.avenue + " " + immobilier.adresse.numero}, ${immobilier.adresse.commune}</p>
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
                    $("#searchImmoContent").append(immobilierContent);
                    // if (sortieImmo == data.getObjet.immobiliers.length) {
                    //     $("#searchImmoContent").append(immobilierContent);
                    // }
                })
            } else {
                $("#searchContent").html(`<div id="notfound">
                        <div class="notfound">
                            <h2>AUCUN RESULTAT POUR VOTRE REHCERCHE</h2>
                            <p>En cas de publication vous recevrez une notification ou soit contacter nous au <b>+243974841783</b> ou à notre adresse email <b>contact@ndakubizz.com</b> pour plus de details</p>
                            <a href="javascript:history.back()">Retour en arriere</a>
                        </div>
                    </div>`);
            }

        }, error: function (err) {
            $("#searchContent").html('');
            $("#searchContent")[0].append(errorServer);
        }
    });

}
// Met en session les clef de recherche
function storageKeys(id, callback) {
    $("#" + id).on('submit', function (e) {
        e.preventDefault();

        var inputs = e.target.elements,
            objData = {},
            sortieInput = 0;

        for (var index = 0; index < inputs.length; index++) {
            sortieInput++;
            if (/input/i.test(e.target.elements[index].localName)) {
                sessionStorage.setItem(inputs[index].name, inputs[index].value);
            }

            if (/textarea/i.test(e.target.elements[index].localName)) {
                sessionStorage.setItem(inputs[index].name, inputs[index].value);
            }

            if (/select/i.test(e.target.elements[index].localName)) {
                sessionStorage.setItem(inputs[index].name, inputs[index].options[inputs[index].selectedIndex].value);
            }

            if (sortieInput == inputs.length) {


                callback(true);

            }
        }
    })
}

//Gere le select mode
function manageModeSearch() {
    var modeBlock = $("#modeSearch").next();
    getAllMode(function (data) {

        data.map(mode => {
            var option = `<option value="${mode._id}">${mode.intitule}</option>`,
                contentModeLi = `<li class="option" data-value="${mode._id}">${mode.intitule}</li>`;
            if (sessionStorage.getItem('mode') == mode._id) {
                option = `<option selected value="${mode._id}">${mode.intitule}</option>`;
                modeBlock[0].getElementsByClassName('current')[0].innerHTML = mode.intitule;
            } else {
                modeBlock[0].getElementsByClassName('current')[0].innerHTML = data[0].intitule;
            }

            modeBlock[0].getElementsByClassName('list')[0].innerHTML += contentModeLi;
            $("#modeSearch").append(option);

        })
    })
}

//Gere le select type
function manageTypeSearch() {
    var typeBlock = $("#typeSearch").next();
    getTypeImmo(function (data) {

        data.map(type => {
            var option = `<option value="${type._id}">${type.intitule}</option>`,
                contenttypeLi = `<li class="option" data-value="${type._id}">${type.intitule}</li>`;
            if (sessionStorage.getItem('type') == type._id) {
                option = `<option selected value="${type._id}">${type.intitule}</option>`;
                typeBlock[0].getElementsByClassName('current')[0].innerHTML = type.intitule;
            } else {
                typeBlock[0].getElementsByClassName('current')[0].innerHTML = data[0].intitule;
            }

            typeBlock[0].getElementsByClassName('list')[0].innerHTML += contenttypeLi;
            $("#typeSearch").append(option);

        })
    })

}
//Gere les inputs de recherche
function inputSearch() {
    //Met les value se trouvant en session dans les inputs
    $("#communeSearch").val(sessionStorage.getItem('commune'));
    $("#nbrePieceSearch").val(sessionStorage.getItem('nbrePiece'));
    $("#montantMinSearch").val(sessionStorage.getItem('montantMin'));
    $("#montantMaxSearch").val(sessionStorage.getItem('montantMax'));
    $("#nbreChambre").val(sessionStorage.getItem('nbreChambre'));
}

function getStatType() {
    $.ajax({
        type: 'GET',
        url: '/api/statType',
        dataType: "json",
        beforeSend: function () {
            typeProp[0].getElementsByClassName('loader09')[0].style.display = "block";
        },
        success: function (data) {
            if (data.getEtat) {
                typeProp[0].getElementsByClassName('loader09')[0].style.display = "none";
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
                                                    <a href="/immo/type/${prop._id}/liste"><img src="/images/bg-img/9.jpg" alt=""></a>
                                                </div>
                                                <!-- Title -->
                                                <a class="categories-title" href="/immo/type/${prop._id}/liste">${customProp(prop.nbreProp ? prop.nbreProp : 0)} </a>
                                                <!-- Property Name and Price -->
                                                <div class="property-name-price-text">
                                                    <a href="/immo/type/${prop._id}/liste">${prop.intitule}</a>
                                                </div>
                                            </div>
                                        </div>`;

                        $("#elementProp").append(contentBody)
                    })
                }
            }

        }, error: function (err) {
            typeProp[0].getElementsByClassName('loader09')[0].style.display = "none";
            typeProp.append(errorServer);
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
        beforeSend: function () {
            newImmo[0].getElementsByClassName('loader09')[0].style.display = "block";
        },
        success: function (data) {
            if (data.getEtat) {
                newImmo[0].getElementsByClassName('loader09')[0].style.display = "none";
                if (data.getObjet.length > 0) {
                    var contentHeadAndFooter =
                        `<div class="row">
                                         <div class="col-12">
                                            <div class="section-heading wow fadeInUp" data-wow-delay="200ms">
                                                <h2>Dernieres <span>annonces</span></h2>
                                            </div>
                                        </div>

                                        <div id="elementNewImmo" class="col-12 row">
                                            
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <center> <a href="/immo/voir-tous-les-immo" class="btn rehomes-btn">Voir
                                                    tous les
                                                    biens <i class="now-ui-icons arrows-1_minimal-right"></i></a>
                                            </center>
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
                          <a href="/immo/${element._id}/details"><img src="${element.detailsImages[0].srcFormat}" alt=""></a>
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
        }, error: function (err) {
            newImmo[0].getElementsByClassName('loader09')[0].style.display = "none";
        }
    });
}

//Recupere les immo par mode
function getImmoByMode(mode_id, bloc_id) {
    var bloc = $("#" + bloc_id);
    $.ajax({
        type: 'GET',
        url: '/api/immo_by_mode/' + mode_id,
        dataType: "json",
        beforeSend: function () {
            bloc[0].getElementsByClassName('loader09')[0].style.display = "block";
        },
        success: function (data) {
            bloc[0].getElementsByClassName('loader09')[0].style.display = "none";
            if (data.getEtat) {
                if (data.getObjet.length > 0) {

                    data.getObjet.map(element => {
                        console.log(element);
                        
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
                                                        <img src="${element.detailsImages[0].srcFormat}" alt="">
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
                bloc.append(noFound);
            }
        },
        error: function (err) {
            bloc[0].getElementsByClassName('loader09')[0].style.display = "none";
            bloc.append(errorServer);
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
                details[0].getElementsByClassName('loader09')[0].style.display = "block";
            },
            success: function (datas) {

                details[0].getElementsByClassName('loader09')[0].style.display = "none";
                if (datas.getEtat) {
                    var obj = datas.getObjet,
                        sortieImages,
                        interestOrNot = () => {

                            if (isMatch) {
                                return `<div class="mt-3">
                                        <button class="btn rehomes-btn mt-10" onclick="viewContact('${obj.id_owner}', '${id}')">Je veux le contacter</button>
                                    </div>`
                            } else {
                                return `<div class="mt-3">
                                        <button class="btn rehomes-btn mt-10">Je veux le contacter</button>
                                    </div>`
                        }
                    },
                    setImagesForSlides = () => {
                        obj.detailsImages.map((value, item) => {
                            sortieImages++;
                            var contentForFisrtDiv = `<div class="post-thumbnail mb-50">
                                    <img style='height:20%;' title="${value.intitule}" src="${value.srcFormat}" alt="">
                                </div>`;

                                $("#carousel-img").append(contentForFisrtDiv);

                            })
                        },
                        content = `<div id="carousel-img" class="col-md-6 blog-slider owl-carousel wow fadeInUp" data-wow-delay="200ms">
                                <!-- Post Thumbnail -->
                            </div>

                            <!-- Properties Content Area -->
                            <div style="padding:5% 3%" class="col-md-5 wow fadeInUp" data-wow-delay="200ms">
                                <div class="properties-content-info">
                                    <h2>${obj.type} à ${obj.adresse.commune} En <span style="color:#8bbe00">${obj.mode}</span></h2>
                                    <div class="properties-location">
                                        <p><i class="fa fa-map-marker" aria-hidden="true"></i> ${obj.adresse.numero + " " + obj.adresse.avenue + ", C/" + obj.adresse.commune + ", Congo"}</p>
                                    </div>
                                    <h4 class="properties-rate">$${obj.prix} <span>${!/Vente|ventes/i.test(obj.mode) ? `/ mois` : ``}</span></h4>
                                    <p>${obj.description}</p>
                                    <!-- Properties Info -->
                                    <p>
                                        ${obj.surface ? `<span style="margin-right:10px;">Superficie: <span>${obj.surface}m<sup>2</sup></span></span>` : ""}
                                        ${obj.nbrePiece ? `<span style="margin-right:10px;">Pièce: <span>${obj.nbrePiece}</span></span>` : ""}
                                        ${obj.nbreChambre ? `<span style="margin-right:10px;">Chambre: <span>${obj.nbreChambre}</span></span>` : ""}
                                        ${obj.nbreDouche ? `<span style="margin-right:10px;">Douche: <span>${obj.nbreDouche}</span></span>` : ""}
                                    </p>
                                    
                                    ${interestOrNot()}
                                </div>
                            </div>`;

                    details.append(content);
                    setImagesForSlides();
                    var blogSlides = $('.blog-slider');
                    blogSlides.owlCarousel({
                        items: 1,
                        margin: 0,
                        loop: true,
                        autoplay: true,
                        smartSpeed: 1000,
                        nav: true,
                        navText: [('<i class="fa fa-chevron-left" aria-hidden="true"></i>'), (' <i class ="fa fa-chevron-right" aria-hidden="true"></i>')]
                    });
                }
            }, error: function (err) {
                details[0].getElementsByClassName('loader09')[0].style.display = "none";
                details.append(errorServer);
            }
        })
    })
}

function displayImage(image) {
    var mainImg = document.getElementById("mainImg");
    mainImg.src = image;
}
function viewContact(id, immo) {
    getUserId((isMatch, result) => {
        if (result) {
            $.ajax({
                type: 'POST',
                url: "/api/int",
                data: {
                    "id_owner": id,
                    "id_immo": immo
                },
                success: function (data) {

                    if (data.getEtat) {
                        var modal = document.getElementById("modalForContactUs");

                        if (data.getObjet.isInLocation) {
                            var obj = data.getObjet;

                            var allContacts = () => {
                                if (obj.contacts.length > 0) {
                                    return `${obj.contacts[0].telephone ? `<font>Téléphone : <span>${obj.contacts[0].telephone}</span></font>` : ""}
                                            ${obj.contacts[0].email ? `<font>E-mail : <span>${obj.contacts[0].email}</span></font>` : ""}`;

                                } else {
                                    return "";
                                }
                            },
                                content = ` <div class="cardThis">
                                    <font class="closeModal" onclick="closeModal()"><i class="fa fa-times-circle"></i></font>
                                    <div class="avatar-owner">
                                        <img src="${obj.image.srcFormat}" alt="${obj.image.name}">
                                    </div>
                                    <div class="info-owner">
                                    <h4 class="noms">${obj.prenom + " " + obj.nom}</h4>
                                    <p class="adresse"><i class="fa fa-map-marker" aria-hidden="true"></i> ${obj.adresse.numero + " " + obj.adresse.avenue + ", C/" + obj.adresse.commune + ", Congo"}</p>

                                    <div class="autresContacts" style="margin-bottom: 30px;">
                                        ${allContacts()}
                                    </div>

                                    <div class="footerContact">
                                        <p>Powered by&nbsp;<span>Ja'Ch Technologies</span></p>
                                    </div>
                                    </div>
                                </div>`;

                            modal.innerHTML = content;
                            modal.classList.remove("d-none");
                        } else {

                            var allContacts = () => {
                                return `<font>Téléphone : <span>+243 974 841 783</span></font>
                                            <font>E-mail : <span>contact@ndakubizz.com</span></font>`;
                            },
                                content = ` <div class="cardThis">
                                    <font class="closeModal" onclick="closeModal()"><i class="fa fa-times-circle"></i></font>
                                    <div class="avatar-owner">
                                        <img src="/images/bg-img/house-3664320_1920.jpg" alt="Image owner">
                                    </div>
                                    <div class="info-owner">
                                    <h4 class="noms">Info administration</h4>
                                    <font class="adresse" style="font-size: .7em;">Contactez l'administration</font>
                                    <p class="adresse" style="margin-bottom: 10px;"><i class="fa fa-map-marker" aria-hidden="true"></i> Local 22 1er Niveau Immeuble Saint Pierre, 374 Av colonel Mondjiba Q/Basoko Kinshasa-Ngaliema, RDC</p>

                                    <div class="autresContacts" style="margin-bottom: 33px;">
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
                    }


                },
                error: function (err) {
                    console.log(err);

                }
            });
        } else {

            var setFlash = document.getElementById("setFlash");

            setFlash.style.display = 'block';
            setFlash.style.backgroundColor = '#f00';
            setFlash.className = 'flash';
            setFlash.style.opacity = '1';

            setTimeout(function () {

                setFlash.style.opacity--;
                setFlash.removeAttribute('class');

                if (setFlash.style.opacity < 0) {
                    setFlash.style.opacity = '0';
                }

            }, 2300);

            setFlash.innerHTML = '<i class="now-ui-icons travel_info"></i>&nbsp;&nbsp;Vous n\'êtes pas connecté...';
        }
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
            $("#immoParTypeBloc")[0].getElementsByClassName('loader09')[0].style.display = "block";
        },
        success: function (data) {
            $("#immoParTypeBloc")[0].getElementsByClassName('loader09')[0].style.display = "none";
            if (data.getEtat) {
                var immoParTypeContent = `<div class="row">
                        <div class="col-12">
                            <div class="section-heading wow fadeInUp" data-wow-delay="200ms">
                                <h2>Immobiliers de type <span id="typeName">${data.getObjet.categorie}</span></h2>
                                <p>il y a des meilleurs deals et deals. tout dans la ville de Kinshasa et aux environs</p>
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
                                                        <img src="${element.detailsImages[0].srcFormat}" alt="">
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
                $("#immoParTypeBloc").append(noFound);
            }
        },
        error: function (err) {
            $("#immoParTypeBloc")[0].getElementsByClassName('loader09')[0].style.display = "none";
            $("#immoParTypeBloc").append(errorServer);
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
                beforeSend: function () {
                    $("#btn_add_immo").text("Publication en cours...");
                },
                success: function (data) {
                    $("#btn_add_immo").text("Terminer");
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
                                    localStorage.removeItem("images");
                                    window.location.pathname = `/profile/${user_id}/publications`;
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

    document.getElementById("selection").addEventListener("click", () => {
        var nameImage = document.getElementById("nameImage");

        if (nameImage && nameImage.value.trim(" ")) {
            //On recupère cette balise
            var input = document.getElementById("imageImmo");

            input.click();

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
                        url: getHostAPI() + "/image-upload",
                        type: 'POST',
                        data: formData,
                        processData: false, // tell jQuery not to process the data
                        contentType: false, // tell jQuery not to set contentType
                        beforeSend: function () {
                            $("#progressImage").fadeIn();
                        },
                        complete: function () {
                        },
                        success: function (data) {
                            
                            console.log(data);
                            
                            AvatarImmo(data);
                            showUploadedImgImmo();
                               
                            $.ajax({
                                type: 'POST',
                                url: `${getHostAPI()}/media/create`,
                                data: {
                                    name: nameImage.value,
                                    path: data.imageUrl,
                                    size: data.size,
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
                                    
                        },
                        xhr: function () {

                            //$(".progress").show();
                            var progressBar = document.getElementById("progressImage");
                            // create an XMLHttpRequest
                            var xhr = new XMLHttpRequest();

                            // listen to the 'progress' event
                            xhr.upload.addEventListener('progress', function (evt) {

                                if (evt.lengthComputable) {
                                    // calculate the percentage of upload completed
                                    var percentComplete = evt.loaded / evt.total;
                                    percentComplete = parseInt(percentComplete * 100);

                                    console.log(percentComplete);

                                    progressBar.getElementsByClassName('progress-bar')[0].style.width = percentComplete + '%';
                                    progressBar.getElementsByClassName('progress-bar')[0].innerHTML = percentComplete + '%';

                                }

                            }, false);

                            xhr.upload.addEventListener("loadend", (evt) => {
                                setTimeout(() => {
                                    progressBar.setAttribute("style", `width: 0%`)
                                    progressBar.style.display = 'none';
                                }, 500);
                            })

                            return xhr;
                        }
                    });


                }

                input.value = "";
            })
        } else {
            nameImage.focus();
            nameImage.setAttribute("placeholder", "Ecrivez d'abord un titre descriptif...")
        }

    })

}

/*Récupère les données de l'upload de cet image*/
function AvatarImmo(data) {

    dataAvatarImmo = data;
}

/*Pour l'affichage de l'image dans sa place*/
function showUploadedImgImmo() {
    var div = document.getElementById("minusImage");

    div.classList.add("contentHere");

    var img = document.createElement("img");

    img.src = dataAvatarImmo.imageUrl;
    img.title = dataAvatarImmo.name;
    img.className = "animated fadeInRight";

    div.append(img);
}

function getAllImmovableForOwner(user_id) {
    $.ajax({
        type: 'GET',
        url: "/api/immobilier/owner/getAll",
        dataType: "json",
        success: function (data) {

            if (data.getEtat) {

                if (data.getObjet.length > 0) {
                    var contentHead = `<div class="header text-center">
                                            <h3 style="border:none;">MES publications</h3>
                                            <p style="margin-bottom: 0px;">differents biens que vous avez publié</p>
                                        </div>
                                        <div class="body row">
                                        <div class="table-responsive">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Détails</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="lineImmoForOwner">
                                                </tbody>
                                            </table>
                                        </div>`;

                    $("#allImmoForOWner").html(contentHead)
                    data.getObjet.map(objet => {
                        var stateThisViaAdmin = () => {
                            if (!objet.validate) {
                                return `<span class="pull-right" style="font-family: calibri;color: #f26522; font-size: .8em"><i
                                        class="now-ui-icons travel_info"></i>&nbsp;&nbsp;En attente de l'approbation de
                                    l'administration</span>`;
                            } else {
                                var manageRemise = () => {
                                    if (objet.alredy_sold) {
                                        return `Remettre
                                        en location ?`;
                                    } else {
                                        return `Déjà pris ?`
                                    }
                                };

                                return `<a style="margin-left: 5px;" class="pull-right" href="#">
                                                        <span
                                                            style="padding: 5px 10px;background-color: #008080;color: #fff;font-family: calibri;border-radius: 15px;font-size: 18px;">${manageRemise()}</span>
                                                    </a>
                                                    <a style="cursor:pointer;" onclick="getContact('${objet.id_user}', '${objet._id}', '${objet.mode}', $(this))" title="Voir les contacts" class="pull-right">
                                                        <span
                                                            style="padding: 5px 10px;background-color: #fff;color: rgba(154,205,50,0.9);font-family: calibri;border-radius: 15px;font-size: 18px;border: 1px solid rgba(154,205,50,0.9)"><i
                                                                class="fa fa-user-plus"></i> ${objet.nbreInterrest} contacts</span>
                                                    </a>`;
                            }
                        },
                            manageSuspension = () => {
                                if (!objet.flag) {
                                    return `<span
                                    style="background-color: rgb(242,101,34,0.9);padding: 5px;color: #fff;font-family: calibri;">•
                                    Suspendu</span>`;
                                } else {
                                    return "";
                                }
                            },
                            contentBody = `<tr>
                            <td>
                                <a href="/immo/${objet._id}/details">
                                    <img class="img-thumbnail" title="${objet.detailsImages[0].intitule}" style="height: 90px;width: 100px;" src="${objet.detailsImages[0].srcFormat}"
                                        alt="">
                                </a>
                            </td>
                            <td>
                                <a href="/immo/${objet._id}/details">
                                    <h4>${objet.type} à ${/location/i.test(objet.mode) ? 'louer' : 'vendre'} se trouvant à ${objet.adresse.commune}</h4>
                                </a>
                                <p style="margin-bottom: 0px; text-transform: capitalize;"><i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;${objet.adresse.avenue} ${objet.adresse.numero},
                                    ${objet.adresse.commune}</p>
                                <p style="font-size: .75em; font-family: calibri;"><i class="fa fa-clock-o"></i>&nbsp;publié le ${customDate(objet.created_at)}</p>
                                <span
                                    style="padding: 5px;background-color: rgba(154,205,50,0.9);color: #fff;font-family: calibri;">•
                                    A ${/location/i.test(objet.mode) ? 'louer' : 'vendre'}</span>
                                ${manageSuspension()}
                                <span style="padding: 5px;color: #aaa;font-family: Poppins; font-weight: 700; font-size: .9em;">• ${objet.prix}$${/location/i.test(objet.mode) ? '/mois' : ''}</span><br>
                                ${stateThisViaAdmin()}
                            </td>
                        </tr>`;

                        $("#lineImmoForOwner").append(contentBody);

                    })
                } else {
                    alert("rien n'y est")
                }
            } else {
                var content = `<div class="col-md-12" style="padding-top:10%;"><center>
                <span style="font-size:200px" class="zmdi zmdi-city-alt icon-menu"></span><p>Votre liste des publication est vide, commencez votre aventure maintenant en publiant vos immobiliers et profitez des avantages qu'offre ndakubizz</p>
                <a href="/profile/${user_id}/publications/ajouter">Publier un bien</a>
                </center></div>`;

                $("#lineImmoForOwner").append(content);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

//Renvoi les contacts d'un immobilier
function getContact(user_id, immo_id, mode, btn) {

    if (/location/i.test(mode)) {

        var innerHTML;
        innerHTML = btn[0].innerHTML;
        $.ajax({
            type: 'GET',
            url: '/api/usersInterestImmo/' + immo_id,
            dataType: "json",
            beforeSend: function () {
                btn[0].innerHTML = "Chargement...";
            },
            success: function (data) {
                $("#listContactModal").html('');
                btn[0].innerHTML = innerHTML;
                if (data.getEtat) {
                    $("#nbreContactModal").text(`Contacts (${data.getObjet.length})`);
                    
                    data.getObjet.map((user, index, tab) => {
                        console.log(user);
                    
                        var setInfo = (name) => {
                                if (user.contacts.length > 0) {
                                    if (user.contacts[user.contacts.length - 1][name]) {
                                        return user.contacts[user.contacts.length - 1][name].toString();
                                    } else {
                                        return "";
                                    }
                                } else {
                                    return "";
                                }
                            },
                            contentBody = `<div class="col-12 col-md-6 col-lg-6">
                                <div class="single-agent-area">
                                
                                    <div class="single-agent-thumb">
                                        <img style="height:14em" src="${user.image.srcFormat}" alt="${user.image.name}">
                                    </div>
                                    
                                    <div class="agent-info">
                                        <a href="#">${(user.prenom + " " + user.nom).toUpperCase()}</a>
                                        <p><i class="fa fa-phone" aria-hidden="true"></i>&nbsp;${setInfo("telephone")}</p>
                                        <p><i class="fa fa-envelope" aria-hidden="true"></i>&nbsp;${setInfo("email")}</p>
                                    </div>
                                </div>
                            </div>`;

                        $("#listContactModal").append(contentBody);
                    });
                    
                    $('.modal_contact').modal('show');

                } else {
                    swal(
                        {
                            title: "CONTACT...",
                            html: "<font style=\"font-family: .4em\">La liste des gens interessés pour cet immobilier est vide</font>",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonText: "OK",
                            confirmButtonColor: "#DD6B55"

                        }
                    );
                }
            },
            error: function (err) {

            }
        });

    } else if (/vente/i.test(mode)) {
        swal(
            {
                title: "CONTACTS VENTE IMMO...",
                html: "<font style=\"font-family: .4em\">Pour voir les contacts des gens interessés, veuillez nous contacter soit au +243974841783, soit par notre adresse email contact@ndakubizz.com ou encore passez à notre adresse au Local 22, 1er Niveau Immeuble Saint Pierre, 374 Av colonel Mondjiba Q/Basoko Kinshasa-Ngaliema, RDC MERCI</font>",
                type: "warning",
                showCancelButton: false,
                confirmButtonText: "Compris !",
                confirmButtonColor: "#DD6B55"

            }
        );
    }
}