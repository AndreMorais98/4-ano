var express = require('express');
var router = express.Router();
var jwt_decode = require('jwt-decode');
var jsonfile = require('jsonfile')
var path = require('path')
var axios = require('axios')
var jwt = require('jsonwebtoken')
const Commons = require('../commons/commons')
var fs = require('fs')

/* Search page */
router.get("/", verifyToken, function(req,res){
  var consumidor = Commons.verifyConsumidor(req.cookies.token)
  var produtor = Commons.verifyProdutor(req.cookies.token)
  res.render('recursos', { title: 'PGR', token: req.cookies.token,isProd: produtor, isCons: consumidor})  
})

router.get("/:id", verifyToken, function(req,res){
  var consumidor = Commons.verifyConsumidor(req.cookies.token)
  var produtor = Commons.verifyProdutor(req.cookies.token)
  var token = req.cookies.token
  u_email = jwt_decode(token).id
  var files = jsonfile.readFileSync(path.resolve(__dirname, '../dbFiles.json'))
  var f
  var name_without_ext
  files.forEach(obj => {
    if(obj["id"] === req.params.id){
      f = obj
      name_without_ext = f.name.split('.').slice(0, -1).join('.')
    }
  });

  
  axios.get('http://localhost:7777/recurso/' + f.id + '?token=' + req.cookies.token)
    .then(data => {
      var conjunto_files = []
  
      var folder_recurso = path.resolve(__dirname, '../') + "/public/fileStore/" + data.data.autor + '/' + name_without_ext + '/data/'
      fs.readdirSync(folder_recurso).forEach(file => {
        conjunto_files.push(file)
      });
        res.render('recurso', {title: 'PGR', data: data.data, token: req.cookies.token,isProd: produtor, isCons: consumidor,f: f, name_without_ext: name_without_ext,u_email:u_email,conjunto_files:conjunto_files})
    })
    .catch(err => res.render('error', {error: err}));

})

router.post("/comment/:recursoId",verifyToken, function(req,res) {
  var token = req.cookies.token
  console.log("here")
  u_email = jwt_decode(token).id
  val = req.body.texto
  console.log(req.body)
  axios.get('http://localhost:7777/users/perfil?email=' + u_email + "&token=" + req.cookies.token)  
      .then (dados => {
        console.log("heree")
        var nome = dados.data.data.nome
        var p = {
            autorId: u_email ,
            recursoId: req.params.recursoId,
            nome: nome,
            text: val,
            nomeId: dados.data.data._id
        }
        console.log(p)
        axios.post('http://localhost:7777/comment?token='+token,p)
        .then(response => { 
          res.redirect('/recursos/'+req.params.recursoId)
        })
        .catch(error => {});      
        })
});

function verifyToken(req,res,next) {
  jwt.verify(req.cookies.token, process.env.SECRET, function(err, decoded) {
    if (err){
      res.cookie('auth', "2", { 
        expires: new Date(Date.now() + '1d'),
        secure: false, // set to true if your using https
        httpOnly: true
        }); 
        res.redirect("/")
    }
    else{
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    req.nivel = decoded.nivel;
    next()
    }
  })
}

module.exports = router;
