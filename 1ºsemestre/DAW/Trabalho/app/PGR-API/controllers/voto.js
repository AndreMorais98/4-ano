var Voto = require("../models/voto");

/* Insere um voto na bd */
module.exports.insert = (recursoID,userID,rating) => {
    var novo = new Voto({recursoID,userID,rating});
    return novo.save();
  };

/* Insere um voto na bd */
module.exports.lookup = (userID,recursoID) => {
    return Voto.find({ recursoID : recursoID, userID: userID});
  };

/* Remove um voto na bd */
module.exports.remove = (recursoID,userID) => {
    return Voto.deleteOne({ recursoID: recursoID, userID: userID }).exec()
};

/* Verifica se um utilizador já votou */
module.exports.userVote = (recursoID,userID) => {
    return Voto.find({ recursoID: recursoID, userID: userID }).exec()
}

/* Num votantes */
module.exports.numVotantes = (id) => {
    return Voto.countDocuments({ recursoID: id })
};

/* Soma do rating */
module.exports.sumRating = (id) => {
    return Voto.aggregate([
                { $group: {
                    _id: "$recursoID",
                    total: { $sum: "$rating" }
                }},
                { $match: {
                    _id: id
                }}
            ]).exec();
};