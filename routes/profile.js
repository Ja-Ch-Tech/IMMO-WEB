var express = require('express');
var router = express.Router();

/* EXECUTE LA PAGE INFORMATIONS DU CLIENT */
router.get('/:user_id/informations', function(req, res, next) {
  res.render('profile/informations', {
	   title: 'Profile',
	   StateClient: req.session.id ? true : false
	});
});

/* EXECUTE LA PAGE PHOTO PROFIL USER */
router.get('/:user_id/photo', function (req, res, next) {
	res.render('profile/photo', {
		title : 'Photo de profile',
	    StateClient: req.session.id ? true : false
	})
})

/* EXECUTE LA PAGE CONFIGURATION DU COMPTE  */
router.get('/:user_id/securite', function (req, res, next) {
	res.render('profile/securite', {
		title : 'Configuration du compte',
	    StateClient: req.session.id ? true : false
	})
})

/* EXECUTE LA PAGE RENVOYANT LES BIENS ou PUBLICATIONS D'UN BAYEUR OU VENDEUR */
router.get('/:user_id/publications', function (req, res, next) {
	res.render('profile/publications', {
		title : 'Vos publications',
	    StateClient: req.session.id ? true : false
	})
})

/* EXECUTE LA PAGE RENVOYANT LE FORMULAIRE D'AJOUR D'UN BIEN */
router.get('/:user_id/publications/ajouter', function (req, res, next) {
	res.render('profile/ajoutBien', {
		title : 'Publiez un bien',
	    StateClient: req.session.id ? true : false
	})
})
module.exports = router;
