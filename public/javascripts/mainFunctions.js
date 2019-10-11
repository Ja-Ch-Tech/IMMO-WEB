/*
	FONCTION PERMETTANT DE GERER LES CHAMPS DU MODE IMMO LORS DE LA PUBLICATION D'UN IMMO
*/
function manageMode(element) {
	
	if (element.val() == "location") {

		$("#ventePrice").fadeOut(function () {
			$("#locationPrice").fadeIn();
		});

	}else if (element.val() == "vente") {
		$("#locationPrice").fadeOut(function () {
			$("#ventePrice").fadeIn();
		});
	}else{
		$("#ventePrice").fadeOut(function () {
			$("#locationPrice").fadeIn();
		});
	}
}