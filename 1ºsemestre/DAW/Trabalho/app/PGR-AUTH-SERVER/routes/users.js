var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../controllers/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require("dotenv-safe").config();

/* Regista um utilizador */
router.post('/registar', (req,res)=>{
  user = req.body
  bcrypt.hash(req.body.password, saltRounds)
  .then( hash => {
    user.password = hash 
    User.insert(user)
    .then(data => res.status(200).json({message: 'User registado com sucesso:'+data}))
    .catch(err => res.status(404).json({message: err}))
  });
})

/* Autenticação utilizador e geração de token para a sessão */
router.post('/login', (req, res, next) => {
  var email = req.body.email 
  var password = req.body.password
  User.lookup(email)
  .then(data => {
    if(data.email == email){
      bcrypt.compare(password, data.password).then(function(result) {
        if(result==true){
          const id = email; 
          const nivel = data.nivel
          const token = jwt.sign({ id, nivel }, process.env.SECRET, {
            expiresIn: 1800 // expires in 30min
          });
          User.updateLastLogin(email) // atualiza data de último login
          return res.json({ auth: true, token: token });
        }else{
          res.status(500).json({message:'Login inválido!'}); // erro no email/password
        }
      });
    }
    else
      res.status(500).json({message: 'Login inválido!'}); // erro no email/password
  })
  .catch(err => res.status(500).json({message: 'Login inválido!'+ err}))  // erro no lookup   
})

/* Logout */
router.post('/logout', function(req, res) {
  res.json({ auth: false, token: null });
})

module.exports = router;
