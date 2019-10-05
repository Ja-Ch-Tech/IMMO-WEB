var errors=[],
    btnNext,
    btnPrev,
    btnFinish;

$(document).ready(function () {
    initInscription();
})


function initInscription() {
	btnNext = $("#next");
	btnPrev = $("#prev");
	btnFinish = $("#finish");
    Inscription();
}

function Inscription() {
    //AU CLIQUE SUR LE PREMIER BOUTON SUIVANT
    btnNext.on('click', function (e) {
    	e.preventDefault();
    	if ($("#pseudonyme").val("")) {
    		errors.push("Veuillez renseigner votre pseudonyme");
    	}
    	if ($("#email").val("")) {
    		errors.push("Veuillez renseigner une adresse email");
    	}
    	if ($("#password").val("")) {
    		errors.push("Veuillez renseigner un mot de passe pour votre compte");
    	}

    	if (errors.length < 0) {
    		var user = {
    			"pseudonyme" : $("#pseudonyme").val(),
    			"email" : $("#email").val(),
    			"password" : $("#password").val()
    		}
    	}else{
    		console.log(errors)
    	}
    	// var user = {
    	// 	""
    	// }
    })
}