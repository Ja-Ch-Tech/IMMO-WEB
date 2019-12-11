var express = require('express');
var router = express.Router();
var session = require('cookie-session');
/* GET home page. */
router.get('/', function(req, res, next) {
  var StateClient = req.session.id ? true : false;
  res.render('index', { 
  	title: 'Bienvenue sur ndakubizz',
  	stateClient: StateClient
  });
})

//CETTE ROUTE FAIT LA DECONNEXION
router.get("/logout", (req, res) => {

    //req.session.id_client ? req.session.id_client = null: res.redirect("/");
    if (req.session.id && req.session.type) {

        req.session.id = null;
        req.session.type = null;

    } else {
        res.redirect("./")
    }

    res.redirect("./");
})

module.exports = router;
