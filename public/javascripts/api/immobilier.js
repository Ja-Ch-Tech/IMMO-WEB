var typeProp, newImmo;

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
                          <img src="/images/bg-img/1.jpg" alt="">
                      </div>

                      <!-- Property Description -->
                      <div class="property-desc-area">
                          <!-- Property Title & Seller -->
                          <div class="property-title-seller d-flex justify-content-between">
                              <!-- Title -->
                              <div class="property-title">
                                  <h4 class="text-uppercase">${element.type}</h4>
                                  <p><i class="fa fa-map-marker" aria-hidden="true"></i> ${element.adresse.avenue + " " +element.adresse.numero}, ${element.adresse.commune}</p>
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