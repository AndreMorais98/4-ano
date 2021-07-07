const mongoose = require('mongoose')

var votoSchema = new mongoose.Schema({
    recursoID : String, 
    userID: String,
    rating: Number
});
 
module.exports = mongoose.model('voto', votoSchema)