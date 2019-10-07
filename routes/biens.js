var express = require('express');
var router = express.Router();

/* DETAILS D'UN BIEN */
router.get('/:bien_id/informations', function(req, res, next) {
  res.render('profile/informations', { 
  	title: 'Profile' 
  });
});

module.exports = router;
