// Recurso controller
var Recurso = require("../models/recurso");
var Voto = require("../controllers/voto");

/* Retorna a lista de recursos */
module.exports.list = (email) => {
  return Recurso.find({ $or: [ { autor: email }, { visibilidade: "publico" } ] }).sort({ dataRegisto: 1 }).exec();
};

/* Retorna a lista de recursos de um utilizador */
module.exports.listByUser = (email1,email2) => {
  if(email1==email2){
    console.log("1")
    return Recurso.find({"autor":email2}).sort({ dataRegisto: 1 }).exec();
  }else{
    console.log("2")
   return Recurso.find({"$and":[{"visibilidade":"publico"},{"autor":email2}]}).sort({ dataRegisto: 1 }).exec();
  }
};

/* Retorna a lista de recursos de um utilizador com dado nome */
module.exports.listByNome = (email,nome) => {
  return Recurso.find({"$or":[{"$and":[{"autor":email},{"nome":{ $regex : new RegExp(nome, "i") }}]},{"$and":[{"visibilidade":"publico"},{"nome":{ $regex : new RegExp(nome, "i") }}]}]}).sort({ dataRegisto: 1 }).exec();
};

/* Retorna a lista de recursos de um tipo */
module.exports.listByTipo = (email,tipo) => {
  return Recurso.find({"$or":[{"$and":[{"autor":email},{"tipo":{ $regex : new RegExp(tipo, "i") }}]},{"$and":[{"visibilidade":"publico"},{"tipo":{ $regex : new RegExp(tipo, "i") }}]}]}).sort({ dataRegisto: 1 }).exec();
};

/* Retorna a lista de recursos de um ano */
module.exports.listByAno = (email,ano) => {
    return Recurso.find({"$or":[{"$and":[{"autor":email},{dataCriacao: { $regex: `^${ano}` }}]},{"$and":[{"visibilidade":"publico"},{dataCriacao: { $regex: `^${ano}` }}]}]}).sort({ dataRegisto: 1 }).exec();
};

/* Retorna a lista de recursos com tags em comum */
module.exports.listByTags = (email,tags) => {
  return Recurso.find({"$or":[{"$and":[{"autor":email},{hashtags: { $in: tags }}]},{"$and":[{"visibilidade":"publico"},{hashtags: { $in: tags }}]}]}).sort({ dataRegisto: 1 }).exec();

};

/* Retorna a lista de recursos com tags em comum */
module.exports.top10 = () => {
  return Recurso.find({"visibilidade":"publico"}).sort({ rating: -1 }).limit(10).exec();
};


/* Insere um recurso na bd */
module.exports.insert = (r) => {
  var novo = new Recurso(r);
  return novo.save();
};

/* Devolve uma lista de tipo de recursos e sua contagem. */
module.exports.tipos = () => {
  return Recurso.aggregate([
    { $group: { _id: "$tipo", count: { $sum: 1 } } },
    { $project: { _id: 1, count: 1 } },
  ]);
};

/* Devolve a informação de um recurso */
module.exports.consultar = id => {
  return Recurso
      .findOne({_id: id})
      .exec()
}

/* Update do rating e número de votos de um recurso */
function updateRating(id,newRating,numVotantes){
  return Recurso.updateOne({_id: id }, {
    rating: newRating, 
    numVotantes: numVotantes
  }).exec();
};

/* Devolve o numero de ficheiros de um utilizador */
module.exports.numFich = (id) => {
  return Recurso.countDocuments({ autorID: id })
};


/* Calcula nova média */
module.exports.updateAverage = (email,rating,id,flag) => {
  // Insere um voto
    if (flag==0){ // new voto
      return Promise.all([
        Voto.userVote(id,email)
        .then(data =>{ 
          console.log("Hh")
          console.log(data)
          if (data!=[]) { 
            return Voto.remove(id,email)
            .then(result =>{
              return Voto.insert(id,email,rating)
              .then(data => {
                return Voto.numVotantes(id)
                .then(result => {
                  numVotantes = result
                  return Voto.sumRating(id)
                  .then(result => {
                    ratingSum = result[0].total
                    newRating = ratingSum / numVotantes
                    // Update no rating e número de votantes do recurso
                    return updateRating(id,newRating,numVotantes)
                    .then(result =>{return result})
                    .catch(err => console.log("Erro no updateRating,"+err))
                  })
                  .catch(err => console.log("Erro no sumRating,"+err))
                })
                .catch(err => console.log("Erro no numVotantes"+err))
              })
              .catch(err => console.log("Erro ao introduzir voto")+err)
            });
          }
          else{
            return Voto.insert(id,email,rating)
            .then(data => {
              return Voto.numVotantes(id)
              .then(result => {
                numVotantes = result
                return Voto.sumRating(id)
                .then(result => {
                  ratingSum = result[0].total
                  newRating = ratingSum / numVotantes
                  // Update no rating e número de votantes do recurso
                  return updateRating(id,newRating,numVotantes)
                  .then(result =>{return result})
                  .catch(err => console.log("Erro no updateRating,"+err))
                })
                .catch(err => console.log("Erro no sumRating,"+err))
              })
              .catch(err => console.log("Erro no numVotantes"+err))
            })
            .catch(err => console.log("Erro ao introduzir voto")+err)
          }
        })
        .catch(err => console.log("Erro no userVote")+err)
      ])
    } 
    else if (flag==1){ // new voto
      return Promise.all([
        Voto.remove(id,email)
        .then(data => {
          return Voto.numVotantes(id)
          .then(result => {
            numVotantes = result
            return Voto.sumRating(id)
            .then(result => {
              console.log(result)
              ratingSum = result[0].total
              newRating = ratingSum / numVotantes
              // Update no rating e número de votantes do recurso
              return updateRating(id,newRating,numVotantes)
              .then(result =>{return result})
              .catch(err => console.log("Erro no updateRating,"+err))
            })
            .catch(err => console.log("Erro no sumRating,"+err))
          })
          .catch(err => console.log("Erro no numVotantes"+err))
        })
        .catch(err => console.log("Erro ao introduzir voto")+err)
      ])
    }
  };
