var errors=[],
    btnNext,
    btnPrev,
    btnFinish,
    user;

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
    	$("#prenomError").html("");
	    $("#nomError").html("");
	    $("#phoneError").html("");
    	errors=[];
    	
    	if ($("#prenom").val().trim() == "") {
    		errors.push("Veuillez renseigner votre prenom");
    		$("#prenomError").html("<i class=\"now-ui-icons travel_info icon_error\"></i>Veuillez renseigner votre prenom");
    	}
    	if ($("#nom").val().trim() == "") {
    		errors.push("Veuillez renseigner votre nom");
    		$("#nomError").html("<i class=\"now-ui-icons travel_info icon_error\"></i>Veuillez renseigner votre nom");
    	}
    	if ($("#telephone").val().trim() == "") {
    		errors.push("Veuillez renseigner un numéro de telephone");
    		$("#phoneError").html("<i class=\"now-ui-icons travel_info icon_error\"></i>Veuillez renseigner un numéro de telephone");
    	}

    	if (errors.length == 0) {
    		user = {
				"username" : null,
				"email" : null,
				"password" : null,
				"type" :null,
				"prenom" : $("#prenom").val(),
				"nom" : $("#nom").val(),
				"telephone" : $("#telephone").val()
			}
			goNext();
    	}else{
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
    	}
    });

    btnFinish.on('click', function (e) {
    	e.preventDefault();
    	$("#usernameError").html("");
	    $("#emailError").html("");
	    $("#passwordError").html("");
    	errors=[];
    	if ($("#pseudonyme").val().trim() == "") {
			errors.push("Veuillez renseigner votre pseudonyme");
			$("#usernameError").html("<i class=\"now-ui-icons travel_info icon_error\"></i>Veuillez renseigner votre pseudonyme");
		}
		if ($("#email").val().trim() == "") {
			errors.push("Veuillez renseigner une adresse email");
			$("#emailError").html("<i class=\"now-ui-icons travel_info icon_error\"></i>Veuillez renseigner votre adresse email");
		}
		if ($("#password").val().trim() == "") {
			errors.push("Veuillez renseigner un mot de passe pour votre compte");
			$("#passwordError").html("<i class=\"now-ui-icons travel_info icon_error\"></i>Veuillez renseigner un mot de passe pour votre compte");
		}
    	if (errors.length == 0) {
    		user.username = $("#pseudonyme").val();
	    	user.email = $("#email").val();
	    	user.password = $("#password").val();
	    	user.type = $("#types")[0].options[$("#types")[0].selectedIndex].value;
    		goFinish();
    	}else{
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
    	}
    	
    })

    btnPrev.on('click', function (e) {
    	e.preventDefault();
    	var li1 = $("#wizard-t-0").parent()[0],
		    li2 = $("#wizard-t-1").parent()[0],
		    div1 = $("#wizard-p-0")[0],
		    div2 = $("#wizard-p-1")[0];
		if (li2.classList.contains("current")) {
			li2.classList.remove("current");
			li2.classList.remove("checked");
			div2.classList.remove("current");
			$("#wizard-p-1")[0].style.display="none";
			

			li1.classList.add("current");
			li1.classList.add("checked");
			div1.classList.add("current");
			$("#wizard-p-0").fadeIn();
		}
    })
}

//Cette fonction permet de gerer le suivant
function goNext() {
	//Vide les erreurs
    $("#prenomError").html("");
    $("#nomError").html("");
    $("#phoneError").html("");

	var li1 = $("#wizard-t-0").parent()[0],
	    li2 = $("#wizard-t-1").parent()[0],
	    div1 = $("#wizard-p-0")[0],
	    div2 = $("#wizard-p-1")[0];
	if (li1.classList.contains("current")) {

		li1.classList.remove("current");
		li1.classList.add("done");
		li1.classList.add("checked");
		div1.classList.remove("current");
		div1.style.display = "none";
		

		li2.classList.add("current");
		li2.classList.add("checked");
		div2.classList.add("current");
		$("#wizard-p-1").fadeIn();

	}
}

//Cette fonction permet de gerer le bouton finish
function goFinish() {
	$("#usernameError").html("");
    $("#emailError").html("");
    $("#passwordError").html("");
	$.ajax({
	    type: 'POST',
	    url: "/api/register",
	    dataType: "json",
	    data: user,
	    beforeSend : function () {
	    	$("#finish").text("Chargement...");
	    },
	    success: function (data) {
	        if (data.getEtat) {
	        	window.location.href = "/profile/" + data.getObjet._id + "/informations";
	        }else{
	        	$("#finish").text("Terminer");
	        	if(data.getMessage == "Celle-ci est déjà utilisé, nous vous suggérons"){
	        		$("#usernameError").html(`<i class="now-ui-icons travel_info icon_error"></i>Ce pseudonyme est deja utililisé, nous vous suggerons <b style='color:#9acd32'>${data.getObjet.suggest[0]}</b> OU <b style='color:#9acd32'>${data.getObjet.suggest[1]}</b>`);

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
			    }
			}
	    }
	});
}