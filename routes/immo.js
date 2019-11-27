var express = require('express');
var router = express.Router();

/* DETAILS D'UN BIEN */
router.get('/:immo_id/details', function(req, res, next) {
  var StateClient = req.session.id ? true : false;
  res.render('immoDetails', { 
	  title: 'Details immobilier',
	  StateClient : StateClient 
  });
});

/* RECUPERE TOUS LES IMMOBILIER */
router.get('/voir-tous-les-immo', function (req, res, next) {
	var StateClient = req.session.id ? true : false;
  	res.render('Allimmob', { 
	  	title: 'Tous les immobiliers',
	  	StateClient : StateClient 
  	});
})

/* BIEN EN LOCATION*/
router.get('/location/:mode_id/liste', function (req, res, next) {
  	var StateClient = req.session.id ? true : false;
	res.render('immoLocation', {
		title: 'Les immobilier en location',
		StateClient: StateClient
	});
});

/* BIEN EN VENTE */
router.get('/vente/:mode_id/liste', function (req, res, next) {
  	var StateClient = req.session.id ? true : false;
	res.render('immoVente', {
		title: 'Les immobilier en vente',
		StateClient: StateClient
	});
});
/* BIEN PAR type (SOIT LOCATION OU VENTE)*/
router.get('/type/:type_id/liste', function (req, res, next) {
	var StateClient = req.session.id ? true : false;
	res.render('immoParType', {
		title: 'Nos immobilier par type',
		StateClient: StateClient
	});
});

// RECHERCHE DES IMMOBILIER
router.get('/recherche', function (req, res, next) {
	res.render('recherche', {
		title : 'Recherche'
	})
})

module.exports = router;
