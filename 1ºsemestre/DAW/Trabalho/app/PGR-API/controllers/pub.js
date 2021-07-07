// Pub controller
var Pub = require('../models/pub')

/* Retorna a lista de recursos */
module.exports.list = (count,page) => {
    return Pub.find().skip(Number((page-1) * count)).sort({"dataCriacao" : -1}).limit(Number(count)).exec()
};

/* Insere uma publicacao na bd */
module.exports.insert = (p) => {
    var novo = new Pub(p)
    return novo.save();
  };

