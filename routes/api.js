var express = require('express');
var router = express.Router();
var axios = require("axios").default;
var API = require("../manageURL").URL().API;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Récupère les stats d'un type
router.get('/statType', (req, res) => {
    axios.get(`${API}/immobilier/getStatType`)
         .then(response => {
            res.status(200);
            res.send(response.data)
         })
         .catch(err => {
             res.status(500);
             res.send(err);
         })
})

//Récupère les nouvelles publications
router.get('/new', (req, res) => {
    axios.get(`${API}/immobilier/getNew/6`)
         .then(response => {
            res.status(200);
            res.send(response.data);
         })
         .catch(err => {
            res.status(500);
            res.send(err)
         })
})

//Permet de faire la creation d'un compte

module.exports = router;