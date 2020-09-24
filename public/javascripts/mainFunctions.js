/*
	FONCTION PERMETTANT DE GERER LES CHAMPS DU MODE IMMO LORS DE LA PUBLICATION D'UN IMMO
*/
function manageMode() {
	var text = window.localStorage.getItem("type_mode_immo");
	if (/location/i.test(text)) {
		$("#ventePrice").html("");
		$("#ventePrice").fadeOut(function () {
			$("#locationPrice").fadeIn();
		});

	}else if (/vente/i.test(text)) {
		$("#locationPrice").fadeOut(function () {
			$("#ventePrice").html(`<label class="label-custom" for="prix_immo_vente">Prix de vente (en $)</label>
                                <input type="number" name="prix" class="form-control mb-20" placeholder="Prix de l'immobilier" id="prix_immo_vente">`)
			$("#ventePrice").fadeIn();
		});

	}else{
		$("#ventePrice").fadeOut(function () {
			$("#locationPrice").fadeIn();
		});
	}
	
}