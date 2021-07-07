const mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    autorId: String,
    text: String,
    recursoId: String,
    nome: String,
    dataCriacao: String,
    nomeId: String
});
 
module.exports = mongoose.model('comment', commentSchema) 
