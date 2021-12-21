var express = require('express');
var router = express.Router();
var axios = require('axios');

var api = 'http://clav-api.di.uminho.pt/v2/classes'
var apit = 'http://clav-api.di.uminho.pt/v2/termosIndice'

var token = "";

axios.post('http://clav-api.di.uminho.pt/v2/users/login', { username: "daw2020@teste.uminho.pt", password: "232" })
  .then(t => token = t.data.token)
  .catch(e => console.log(e));

/*function axiosTest() {
  return axios.post("http://clav-api.di.uminho.pt/v2/users/login",{"username": "daw2020@teste.uminho.pt", "password": "232"})
  .then(response => response.data.token)
}*/

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',{ token: token})
});

/* GET lista das classes page. */
router.get('/classes', function(req, res) {
  axios.get(api+'?nivel=1&token=' + token)
    .then(dados=>{
      res.render('classes',{ lista: dados.data})
    })
    .catch(erro=>{
      res.render('error',{error: erro});
      })
});

router.get('/termosIndice', function(req, res) {
  axios.get(apit+'?token=' + token)
    .then(dados=>{
      res.render('termosIndice',{ lista: dados.data})
    })
    .catch(erro=>{
      res.render('error',{error: erro});
      })
});


/* GET codigo page*/ 
router.get('/classes/:codigo', function(req,res){
  var codigo = req.params.codigo
  var nivel3 = 0
  var array= []
  axios.get(api+'/'+codigo+'?token='+token)
    .then(dados=> {
      pai = dados.data.pai.codigo
      if(dados.data.nivel == 1){
        pai = 0
      }
      if(dados.data.nivel == 3){
        nivel3 = 1
      }
      res.render('codigo',{classe: dados.data, arr: array, bool: nivel3, pai: pai})
    })
    .catch(erro => res.render('error',{error:erro}))
})


router.get('/classes/:id', function(req, res, next) {
  axios.get(api + '/c' + req.params.id + '?token=' + token)
    .then(dados => {
      if(dados.data.nivel == 3){
        axios.get(api + '/c' + req.params.id + '/ti?token=' + token)
          .then(ti => {
            res.render('classe', {title: "Classe " + dados.data.codigo, classe: dados.data, termosIndice: ti.data  })
          })
      } else {
        res.render('classe', {title: "Classe " + dados.data.codigo, classe: dados.data })
      }
    })
    .catch(e => res.render('error', {error: e}));
});


module.exports = router;