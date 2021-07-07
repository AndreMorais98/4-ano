const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    nome: String,
    email: String,
    filiacao: String,
    nivel: String,
    dataRegisto: String,
    dataUltimoAcesso: String,
    password: String
});
  
module.exports = mongoose.model('user', userSchema)

