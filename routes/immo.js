var express = require('express');
var router = express.Router();

/* DETAILS D'UN BIEN */
router.get('/:immo_id/details', function(req, res, next) {
  res.render('immoDetails', { 
  	title: 'Details immobilier' 
  });
});

/* BIEN EN LOCATION*/
router.get('/location/:mode_id/liste', function (req, res, next) {
	res.render('immoLocation', {
		title: 'Les immobilier en location'
	});
});

/* BIEN EN VENTE */
router.get('/vente/:mode_id/liste', function (req, res, next) {
	res.render('immoVente', {
		title: 'Les immobilier en vente'
	});
});
/* BIEN PAR type (SOIT LOCATION OU VENTE)*/
router.get('/type/:type_id/liste', function (req, res, next) {
	res.render('immoParType', {
		title: 'Nos immobilier par type'
	});
});

module.exports = router;
