const ConfigParser = require('configparser');
const fs = require('fs');
const { hostname } = require('os');
var readline = require('readline');
var moment = require('moment')





module.exports.host = () => {
    const config = new ConfigParser();
    config.read("/home/morais/Desktop/snmp/src/logs/config.cfg")
    return config.sections();
}




module.exports.pidram = hostname => {
    const array = []
    files = fs.readdirSync("/home/morais/Desktop/snmp/src/logs/ram/" + hostname +"/")
    files.forEach (file => {
        data = fs.readFileSync("/home/morais/Desktop/snmp/src/logs/ram/" + hostname +"/" + file, 'utf8')
        nome = data.toString().split('\n');
        nome = nome.shift();
        percentagem = data.toString().split('\n');
        percentagem = percentagem.splice(-2,1)[0];
        array.push({"pid" : file.split(".txt")[0], "nome": nome, "percentagem": percentagem.split(",")[0]})
    })
    return array
}

module.exports.pidcpu = hostname => {
    const array = []
    files = fs.readdirSync("/home/morais/Desktop/snmp/src/logs/cpu/" + hostname +"/")
    files.forEach (file => {
        data = fs.readFileSync("/home/morais/Desktop/snmp/src/logs/cpu/" + hostname +"/" + file, 'utf8')
        nome = data.toString().split('\n');
        nome = nome.shift();
        percentagem = data.toString().split('\n');
        percentagem = percentagem.splice(-2,1)[0];
        array.push({"pid" : file.split(".txt")[0], "nome": nome, "percentagem": percentagem.split(",")[0]})
    })
    return array
}

module.exports.graphr = (hostname,file) => {
    arr = []
    date = []
    perc = []
    data = fs.readFileSync("/home/morais/Desktop/snmp/src/logs/ram/" + hostname +"/" + file + ".txt", 'utf8')
    percentagem = data.toString().split('\n');
    for(i=1; i < percentagem.length - 1; i++){
        arr2 = []
        date = percentagem[i].split(",")[1]
        perc = percentagem[i].split(",")[0]
        arr2.push(moment(new Date(date)).format('YYYY-MM-DD hh:mm:ss'),parseFloat(perc))
        arr.push(arr2)
    }
    //console.log(arr);
    return arr
}

module.exports.graphc = (hostname,file) => {
    arr = []
    date = []
    perc = []
    data = fs.readFileSync("/home/morais/Desktop/snmp/src/logs/cpu/" + hostname +"/" + file + ".txt", 'utf8')
    percentagem = data.toString().split('\n');
    for(i=1; i < percentagem.length - 1; i++){
        arr2 = []
        date = percentagem[i].split(",")[1]
        perc = percentagem[i].split(",")[0]
        arr2.push(moment(new Date(date)).format('YYYY-MM-DD hh:mm:ss'),parseFloat(perc))
        arr.push(arr2)
    }
    //console.log(arr);
    return arr
}



module.exports.nomeproc = (hostname,file) => {
    data = fs.readFileSync("/home/morais/Desktop/snmp/src/logs/ram/" + hostname +"/" + file + ".txt", 'utf8')
    nome = data.toString().split('\n');
    nome = nome.shift();
    //console.log(nome)
    return nome
}
