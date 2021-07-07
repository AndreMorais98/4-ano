var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../controllers/user');


router.get('/', function(req, res) {
  if(req.cookies.auth == "1"){
    res.cookie("auth", {expires: Date.now});
    res.render('login', { title: 'VR', err: "1" });
  }
  if(req.cookies.auth == "2"){
    res.cookie("auth", {expires: Date.now});
    res.render('login', { title: 'VR', err: "2" });
  }
  res.render('login', { title: 'VR' });
});

router.get('/registar', function(req, res) {
  res.render('registar', { title: 'VR' });
});

router.get('/profile/', function(req, res) {
  if(req.cookies.logout == "1") { // verifica se sessão deu logout
    res.cookie('auth', "2", { 
      expires: new Date(Date.now() + '1d'),
      secure: false, // set to true if your using https
      httpOnly: true
     }); 
     res.redirect("/")
  }
  res.render('profile', { title: 'VR'});
});

router.get('/auth',function(req, res) {
  link = req.query.link
  token = req.cookies.token
  if(token == null){
    res.render('login', { title: 'VR' });
  }
  else{
    console.log(token)
    res.render('auth', { title: 'VR' });
  }

});


/* Autenticação utilizador e geração de token para a sessão */
router.post('/login', (req, res) => {
  var email = req.body.email
  var password = req.body.password
  User.lookup(email)
  .then(data => {
    if(data.email == email && data.password == password){
      const id = email; 
      const token = jwt.sign({ id }, "segredo", {
        expiresIn: 1800 // expires in 30min
      });
      res.cookie('logout', {expires: Date.now()});
      res.cookie('auth', {expires: Date.now()});
      res.cookie("token", token, {
        expires: new Date(Date.now() + "1d"),
        secure: false, // set to true if your using https
        httpOnly: true,
      });
      res.redirect('/auth')
    }
    else{
      res.cookie("auth", "1", {
        expires: new Date(Date.now() + "1d"),
        secure: false, // set to true if your using https
        httpOnly: true,
      });
      res.redirect("/");
    }
  })
  .catch(err => res.status(500).json({message: 'Login inválido!'+ err}))  // erro no lookup   
})


router.post('/registar', (req,res)=>{
  user = req.body
  User.insert(user)
  .then(data => res.redirect('/'))
  .catch(err => res.status(404).json({message: err}))
})

/* Logout */
router.get("/logout",verifyToken, function(req,res){
  res.cookie('logout', "1", {
    expires: new Date(Date.now() + '1d'),
    secure: false, // set to true if your using https
    httpOnly: true
  })
  res.cookie('token', {expires: Date.now()});
  res.redirect("/")
})

function verifyToken(req,res,next) {
  jwt.verify(req.cookies.token, 'segredo', function(err, decoded) {
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
    next()
    }
  })
}


module.exports = router;
