var express = require('express');
var router = express.Router();
var axios = require('axios'); 
var Batismos = require('../controllers/batismos.js')

//GET /api/obras
router.get('/batismos', function(req,res){
  var ano = req.query.ano
 if(ano){
  if (ano.length==4){
    Batismos.listporAno(ano)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
  }else{
    res.jsonp([])
  }
  }
else{
  Batismos.listar()
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
}
});


router.get('/batismos/batisado',function(req,res){
  Batismos.batisado()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})


router.get('/batismos/progenitores',function(req,res){
  Batismos.progenitor()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

router.get('/batismos/stats',function(req,res){
  Batismos.stats()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

router.get('/batismos/:id',function(req,res){
  Batismos.consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})


module.exports=router;