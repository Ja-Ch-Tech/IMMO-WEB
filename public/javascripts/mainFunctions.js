/*
	FONCTION PERMETTANT DE GERER LES CHAMPS DU MODE IMMO LORS DE LA PUBLICATION D'UN IMMO
*/
function manageMode(element) {
	var text = element.next()[0].getElementsByClassName('current')[0].innerHTML;
	if (/location/i.test(text)) {
		$("#ventePrice").html("");
		$("#ventePrice").fadeOut(function () {
			$("#locationPrice").html(`<label class="label-custom" for="loyeur_mensuel">Loyer mensuel (en $)</label>
                                <input type="number" name="prix" class="form-control mb-20" placeholder="Loyer mensuel" id="loyeur_mensuel">`);
			$("#locationPrice").fadeIn();
		});

	}else if (/vente/i.test(text)) {
		$("#locationPrice").html("");
		$("#locationPrice").fadeOut(function () {
			$("#ventePrice").html(`<label class="label-custom" for="prix_immo_vente">Prix de vente (en $)</label>
                                <input type="number" name="prix" class="form-control mb-20" placeholder="Prix de l'immobilier" id="prix_immo_vente">`)
			$("#ventePrice").fadeIn();
		});

	}else{
		$("#ventePrice").fadeOut(function () {
			$("#locationPrice").html(`<label class="label-custom" for="loyeur_mensuel">Loyer mensuel (en $)</label>
                                <input type="number" name="prix" class="form-control mb-20" placeholder="Loyer mensuel" id="loyeur_mensuel">`);
			$("#locationPrice").fadeIn();
		});
	}
	
}