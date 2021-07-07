var express = require('express');
var router = express.Router();
var moment = require('moment'); 
const Recurso = require('../controllers/recurso');
const Voto = require('../controllers/voto');
var jwt_decode = require('jwt-decode');

/* GET lista de recursos por utilizador/tipo/ano/hashtag */
router.get('/lista', function(req, res, next) {
    // query strings
    var autor = req.query.autor
    var tipo = req.query.tipo
    var ano = req.query.ano
    var tags = req.query.tags
    var nome = req.query.nome
    u_mail = jwt_decode(req.query.token).id // retira email da cookie
    if(tags){
        var array_tags = tags.split(" ")
        Recurso.listByTags(u_mail,array_tags)
        .then(data => res.status(200).json({data: data}))
        .catch(err => res.status(500).json({message: err}))
    }
    else if(autor){
        Recurso.listByUser(u_mail,autor)
        .then(data => res.status(200).json({data: data}))
        .catch(err => res.status(500).json({message: err}))
    }
    else if(tipo){
        Recurso.listByTipo(u_mail,tipo)
        .then(data => res.status(200).json({data: data}))
        .catch(err => res.status(500).json({message: err}))
    }
    else if(nome){
        Recurso.listByNome(u_mail,nome)
        .then(data => res.status(200).json({data: data}))
        .catch(err => res.status(500).json({message: err}))
    }
    else if(ano){
        if(ano.length==4){
            Recurso.listByAno(u_mail,ano)
            .then(data => res.status(200).json({data: data}))
            .catch(err => res.status(500).json({message: err}))
        }else res.status(200).json({data: [] })  
    }
    else{
        Recurso.list(u_mail)
        .then(data => res.status(200).json({data: data}))
        .catch(err => res.status(500).json({message: err}))
    }
});

router.get('/numFich/:id', function(req,res){
    Recurso.numFich(req.params.id)
    .then(data => res.status(200).json({data: data}))
    .catch(err => res.status(500).json({message: err}))
});

router.get('/top', function(req,res){
    Recurso.top10()
    .then(data => res.status(200).json({data: data}))
    .catch(err => res.status(500).json({message: err}))
});

/* POST de um recurso */
router.post('/', (req, res) => {
    rec = req.body
    console.log(rec)
    rec.dataRegisto = moment(new Date(Date.now())).format('YYYY-MM-DD hh:mm:ss')
    rec.dataCriacao = moment(new Date(req.body.dataCriacao)).format('YYYY-MM-DD')
    rec.numVotantes = 0
    rec.rating = 0
    Recurso.insert(rec)
    .then(data => res.status(200).json({message: data._id}))
    .catch(err => res.status(404).json({message: 'Recurso não inserido!'+ err})) 
});

/* GET tipos  um recurso */
router.get('/tipos', (req, res) => {
    Recurso.tipos()
    .then(data => res.status(200).json({message: data}))
    .catch(err => res.status(500).json({message: err})) 
});

/* GET id de um recurso */
router.get('/:id', (req, res) => {
    Recurso.consultar(req.params.id)
        .then(dados => res.status(200).jsonp(dados) )
        .catch(e => res.status(500).jsonp({error: e}))
});

/* POST de um voto */
router.post('/voto',(req,res)=>{
    Recurso.updateAverage(req.body.userID,req.body.rating,req.body.recursoID,req.body.flag)
    .then(data => 
    {
        Recurso.consultar(req.body.recursoID)
        .then(data=>res.status(200).json({message: data.rating}))
        .catch(err => res.status(500).json({message: err}))
        
    })
    .catch(err => res.status(500).json({message: err}))
});

/* Voto de um utilizador */
router.get('/voto/:userID/:recursoID', function(req, res, next) {
    Voto.lookup(req.params.userID,req.params.recursoID)
    .then(data => res.status(200).json({message: data[0].rating}))
    .catch(err => res.status(500).json({message: err}))
});


module.exports = router;