const mongoose = require('mongoose')

var pubSchema = new mongoose.Schema({
    prodId: String,
    prodName: String,
    recursoTitulo: String,
    recursoDescricao: String,
    recursoTipo: String,
    recursoId: String,
    dataCriacao: String
});
 
module.exports = mongoose.model('pub', pubSchema) 
