var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var StateClient = req.session.id ? true : false;
  res.render('apropos', { 
    title: 'La meilleure agence immobilière de qualité à Kinshasa RDC',
    StateClient: StateClient
  });
})

module.exports = router;
