var jsonfile = require('jsonfile')

var files = jsonfile.readFileSync("./batismos.json")

for (var i = 0; i < files.length; i++){
    files[i]["_id"] = files[i]["ref"].replace(/\//g, "_");
    var parts = files[i]["title"].split(";") 
    var ano = files[i]["date"].split("-")[0] 
    var pai = parts[0].split("Pai:")[1]
    var mae = parts[1].split("Mãe:")[1]
    
    files[i]["pai"] = pai.substring(1)
    files[i]["mae"] = mae.substring(1)
    files[i]["ano"] = ano
}

jsonfile.writeFileSync("./batismos_fixed.json",files)