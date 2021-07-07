// User controller
var User = require('../models/user')

/* Retorna a lista de utilizadores */
module.exports.list = () => {
    return User
        .find()
        .sort({nome:1})
        .exec()
}

/* Procura pelo email um utilizador */
module.exports.lookupEm = id => {
    return User
        .findOne({email: id})
        .exec()
}

/* Procura pelo id um utilizador */
module.exports.lookupId = id => {
    return User
        .findOne({_id: id})
        .exec()
}

/* Insere um utilizador na bd */
module.exports.insert = u => {
    var novo = new User(u)
    return novo.save()
}

/* Remove um utilizador da bd */
module.exports.remove = id => {
    return User
        .deleteOne({_id: id})
        .exec()
}
