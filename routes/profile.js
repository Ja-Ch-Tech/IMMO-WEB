var express = require('express');
var router = express.Router();

/* EXECUTE LA PAGE INFORMATIONS DU CLIENT */
router.get('/:user_id/informations', function(req, res, next) {
  res.render('profile/informations', { title: 'Profile' });
});

module.exports = router;
