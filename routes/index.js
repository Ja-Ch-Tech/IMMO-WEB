var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var StateClient = req.session.id ? true : false;
  res.render('index', { 
  	title: 'Bienvenue sur notre site',
  	stateClient: StateClient
  });
})

module.exports = router;
