var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var StateClient = req.session.id ? true : false;
  res.render('apropos', { 
    title: 'Une agence immobilière de qualité et professionnelle',
    StateClient: StateClient
  });
})

module.exports = router;
