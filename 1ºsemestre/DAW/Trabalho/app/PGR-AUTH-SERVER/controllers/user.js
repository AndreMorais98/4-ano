// User controller
var User = require('../models/user')
var moment = require('moment'); 
/* Procura um utilizador na bd pelo email */
module.exports.lookup = id => {
    return User
        .findOne({email: id})
        .exec()
}

/* Insere um utilizador na bd */
module.exports.insert = u => {
    var novo = new User(u)
    return novo.save()
}

/* Recebe id de um utilizador e atualiza data de último acesso */
module.exports.updateLastLogin = id => {
    data = moment(new Date(Date.now())).format('YYYY-MM-DD hh:mm:ss')
    return User
        .updateOne({email: id},  {$set: {dataUltimoAcesso: data }} )
        .exec()
}

