const mongoose = require('mongoose')

var recSchema = new mongoose.Schema({
    tipo :  String, // Relatorio,tese,exame,artigo,aplicacao,slides
    titulo: String,
    descricao: String,
    subtitulo: String, // Opcional 
    dataCriacao: String, 
    dataRegisto : String, // Data no sistema
    visibilidade: String, // Publico,Privado
    hashtags: [String],
    rating: Number,
    numVotantes: Number,
    autor: String,
    nome: String,
    autorID: String
});
 
module.exports = mongoose.model('recurso', recSchema)