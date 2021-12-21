var Batismo = require('../models/batismos')

// Devolve a lista dos batismos, com os campos: _id, date, title e ref;
module.exports.listar = () => {
    return Batismo
            .find({},{_id:1,date:1,title:1,ref:1})
            .exec()
}

// Devolve a informação completa de um batismo;
module.exports.progenitor = id =>{
    return Batismo
            .find({}, {_id :1, pai: 1, mae: 1})
            .exec()
}

// Devolve apenas uma lista com os nomes dos indivíduos batizados ordenada alfabeticamente;
module.exports.batisado = () =>{
    return Batismo.aggregate([
        { $addFields: {
            "lista": { $regexFind: { input: "$title", regex: "(?<=: ).*(?=\. Pai)" } }
         }
        },
        {$sort: {lista: 1}},
        {$group:
            {_id:null,
            batisados:{$push:{id:"$_id",batisado:"$lista.match"}}
            }
        },
        {
        $project: {
            _id:0,
          batisados:1
        }}
      
    ]).exec();
}

//  Devolve uma lista de triplos em que cada triplo tem a seguinte estrutura: {_id: "identificador do registo original", pai: "nome do pai do indivíduo que foi batizado", mae: "nome da mae do indivíduo que foi batizado"}; Esta alínea poderá ser resolvida de várias maneira e irá depender da forma como resolveste as primeiras
module.exports.consultar = id =>{
    return Batismo
            .find({_id :id})
            .exec()
}


// Devolve a lista de casamentos realizados no ano YYYY;
module.exports.listporAno = ano =>{
    return Batismo
            .find({date: {$regex: ano}})
            .exec()
}


// Devolve uma lista de pares, ano e número de batismos nesse ano.
module.exports.stats = () =>{
    return Batismo.aggregate( [
        { $group: { _id: "$ano" ,  count: { $sum: 1 } } },
        { $project: { _id: 1, count: 1 } }
     ] )
}
