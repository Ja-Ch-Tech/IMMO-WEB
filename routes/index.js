var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'Bienvenue sur notre site',
  	stateClient: req.session.id ? true : false,
  	username : req.session.username ? req.session.username : null,
  	type_user : req.session.type ? req.session.type : null
  });
})

module.exports = router;
