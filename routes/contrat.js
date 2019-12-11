var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/termes_et_conditions', function(req, res, next) {
  var StateClient = req.session.id ? true : false;
  res.render('termes_et_conditions', { 
    title: 'Nos termes et conditions générales ?',
    StateClient: StateClient
  });
})

module.exports = router;
