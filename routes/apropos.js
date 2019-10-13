var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var StateClient = req.session.id ? true : false;
  res.render('apropos', { 
    title: 'Qui somme nous ?',
    StateClient: StateClient
  });
})

module.exports = router;
