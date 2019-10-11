var express = require('express');
var router = express.Router();
var axios = require("axios").default;
var API = require("../manageURL").URL().API;
var session = require("cookie-session");

var app = express();

app.use(session({
    secret: "frdrcpeterAppImmo"
}))

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

//Permet de faire la connexion

router.post('/login', (req, res) => {
    if ((req.body.username && req.body.username.trim(" ")) || (req.body.password && req.body.password.trim(" "))) {
        var data = {
            username: req.body.username,
            password: req.body.password
        }
        
        axios.post(`${API}/users/login`, data)
            .then(datas => {

                if (datas.data.getEtat) {
                    req.session.id = datas.data.getObjet.id_client;
                    req.session.type = datas.data.getObjet.type;

                    if (req.session.id) {
                        console.log("Mise en session de " + req.session.id);

                        console.log(req.session.id + " : " +req.session.type);
                        
                        res.status(200);
                        res.send(datas.data);
                    }

                } else {

                    res.status(200);
                    res.send(datas.data)
                }
            })
            .catch(error => {
                res.send(error)
            })
    } else {
        res.send({ getEtat: false, getMessage: "Champ obligatoire" })
    }
})


//Gere la creation d'un compte
router.post('/register', (req, res) => {

    if ((req.body.username && req.body.username.trim(" ")) ||
        (req.body.email && req.body.email.trim(" ")) ||
        (req.body.password && req.body.password.trim(" ")) ||
        (req.body.type && req.body.type.trim(" ")) ||
        (req.body.prenom && req.body.prenom.trim(" ")) ||
        (req.body.telephone && req.body.telephone.trim(" ")) ||
        (req.body.nom && req.body.nom.trim(" "))) 
    {
        var data = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
            prenom: req.body.prenom,
            telephone: req.body.telephone,
            nom: req.body.nom
        }

        axios.post(`${API}/users/register`, data)
            .then(datas => {

                if (datas.data.getEtat) {
                    req.session.id = datas.data.getObjet._id;
                    req.session.type = datas.data.getObjet.type;
                    req.session.username = datas.data.getObjet.login.username;

                      res.status(200);
                      res.send(datas.data);

                } else {

                    res.status(200);
                    res.send(datas.data)
                }
            })
            .catch(error => {
                res.send(error)
            })
    }else{
        res.send({
            getEtat : false,
            getMessage : "Certains champs obligatoires sont vides"
        })
    }
})

//Permet de recuperer les types users
router.get('/type_user', (req, res) => {
   axios.get(`${API}/typeUser/getAll`)
        .then(response => {
            res.status(200);
            res.send(response.data)
        })
        .catch(err => {
            res.status(500);
            res.send(err)
        }) 
});

//Recupere les immo par mode
router.get('/immo_by_mode/:id_immo', (req, res) => {
    axios.get(`${API}/immobilier/getAllByMode/${req.params.id_immo}`)
        .then(response => {
            res.status(200);
            res.send(response.data)
        })
        .catch(err => {
            res.status(500);
            res.send(err)
    }) 
});

module.exports = router;