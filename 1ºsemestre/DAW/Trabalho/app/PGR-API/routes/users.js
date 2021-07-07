var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../controllers/user');

/* GET lista de utilizadores */
router.get('/lista', function(req, res, next) {
  User.list()
    .then(data => res.status(200).json({data: data}))
    .catch(err => res.status(500).json({message: err}))
  });

/* GET perfil de um utilizador por ?id/email */
router.get('/perfil', function(req, res, next) { 
  var id = req.query.id
  var email = req.query.email
  if(id){
    User.lookupId(id)
      .then(data => res.status(200).json({data: data}))
      .catch(err => res.status(500).json({message: err}))
  }
  if(email){
    User.lookupEm(email)
      .then(data => res.status(200).json({data: data}))
      .catch(err => res.status(500).json({message: err}))
  }
  });

  router.delete('/remove/:id', function(req, res, next) {
    var id = req.params.id
    User.remove(id)
      .then(data => res.status(200).json({data: data}))
      .catch(err => res.status(500).json({message: err}))
    });
module.exports = router;
