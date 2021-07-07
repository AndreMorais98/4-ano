// User controller
var User = require("../models/user");

/* Procura um utilizador na bd pelo email */
module.exports.lookup = (id) => {
  return User.findOne({ email: id }).exec();
};

/* Insere um utilizador na bd */
module.exports.insert = (u) => {
  var novo = new User(u);
  return novo.save();
};

/* Associa id a um utilizador */
module.exports.insertCert = (certId, id) => {
  return User.updateOne({ email: id }, { $push: { certs: certId } });
};

/* Verifica se pode aceder */
module.exports.checkCertAcess = (uId, certId) => {
  return User.find({ email: uId, certs: certId }).exec();
};
