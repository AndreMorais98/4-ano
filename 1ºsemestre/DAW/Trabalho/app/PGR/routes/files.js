var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var fs = require('fs')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var path = require('path')
var jwt_decode = require('jwt-decode');
var AdmZip = require('adm-zip');
var axios = require('axios')
const Recurso = require('../models/recurso');
const Pub = require('../models/pub');
var jwt = require('jsonwebtoken')
var Commons = require('../commons/commons')

/* GET upload */
router.get('/upload',verifyToken,function(req,res){
    var consumidor = Commons.verifyConsumidor(req.cookies.token)
    if(!consumidor){
        var consumidor = Commons.verifyConsumidor(req.cookies.token)
        var produtor = Commons.verifyProdutor(req.cookies.token)
        var d = new Date().toISOString().substring(0,16)
        res.render("fileForm",{title:"File Upload",d: d,isCons:consumidor,isProd: produtor})
    }
    else{
        res.render("naoaut", { title: 'PGR' })
    }
})
  
/* Download file */
router.get('/download/:u_email/:fname',verifyToken, function(req,res){

    // ---------------------- Zippa de novo ------------------------

    var archiver = require('archiver');
    var archive = archiver('zip');
    var name_without_ext = req.params.fname.split('.').slice(0, -1).join('.')
    var source_dir = path.resolve(__dirname, '../') + "/public/fileStore/" + req.params.u_email + '/' + name_without_ext
    let newZip = path.resolve(__dirname, '../') + '/public/fileStore/' + req.params.u_email + '/' + req.params.fname
    var output = fs.createWriteStream(newZip);

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        res.download(newZip, function(err) {
            if (err) console.log(err);
            fs.unlink(newZip, function(){
                console.log("File was deleted")
            });
        });
    });

    archive.on('error', function(err){
        throw err;
    });

    archive.pipe(output);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(source_dir, false);

    // append files from a sub-directory and naming it `new-subdir` within the archive
    archive.directory('subdir/', 'new-subdir');

    archive.finalize();

    // -------------------------------------------------------------
})


/* POST file */
router.post('/',upload.array('myFile'), function(req,res){

    var token = req.cookies.token
    u_email = jwt_decode(token).id
    
    axios.get('http://localhost:7777/users/perfil?email=' + u_email + "&token=" + token)  
        .then(response => {
            var id = response.data.data._id
            var nome = response.data.data.nome
            var erros = []
        
            req.files.forEach((f,idx) => {

                // ----------- Prepara o upload para o fileStore -----------

                let oldPath = path.resolve(__dirname, '../') + '/' + f.path
                let newPath = path.resolve(__dirname, '../') + '/public/fileStore/' + u_email + '/'
                
        
                if (!fs.existsSync(newPath)){
                    fs.mkdirSync(newPath);
                }
                
                // ------------ Checkar manifesto -------------------------

                var zip2 = new AdmZip(oldPath);
                var zipEntries2 = zip2.getEntries();
                var meta_dados2 = [];
                var manifest = ""
                var found = false
                var count = 0
                var pdf_pptx = 0
                zipEntries2.forEach(function(zipEntry2) {
                    if(zipEntry2.name != "manifesto.json" && zipEntry2.isDirectory == false)
                        meta_dados2.push(zipEntry2.entryName.substring(5));
                    if(zipEntry2.entryName == "manifesto.json") {
                        manifest = zipEntry2.getData().toString('utf8')
                    }
                    if(zipEntry2.entryName == "data/")
                        found = true
                    if(!zipEntry2.entryName.includes('data/'))
                        count++;
                    if(zipEntry2.entryName.includes(".pdf") || zipEntry2.entryName.includes(".pptx"))
                        pdf_pptx++;
                });
                if(count == 1 && found == true && manifest != "" && Commons.manifestValidator(meta_dados2,manifest,req.body.tipo)){

                    // --------------- Extrai a extensão ----------------------
                    
                    console.log("meta_dados2 = " + meta_dados2)

                    if(meta_dados2.length == 1){
                        var ext = path.extname(meta_dados2[0]).substring(1)
                    }
                    else
                        var ext = "zip"

                    // ----------- Faz upload ------------------------

                    let filePath = newPath + f.originalname
                    
                    fs.rename(oldPath,filePath, function (err){
                        if(err) throw err
                    })

                    // --------------- Cria novo recurso -------------

                    var r = new Recurso()
                    var pub = new Pub()
                    var n = req.files.length

                    if(n > 1){
                        r.tipo = req.body.tipo[idx], // Relatorio,tese,exame,artigo,aplicacao,slides
                        r.titulo = req.body.titulo[idx]
                        r.descricao = req.body.desc[idx]
                        r.subtitulo = req.body.subtitulo[idx] // Opcional 
                        r.dataCriacao = req.body.dataCriacao[idx] 
                        r.visibilidade = req.body.visibilidade[idx]
                        r.hashtags = req.body.hashtags[idx].split(",")
                        r.nome = nome
                        pub.recursoTitulo = req.body.titulo[idx]
                        pub.recursoDescricao = req.body.desc[idx]
                        pub.recursoTipo = req.body.tipo[idx]    
                    }
                    else if (n == 1){
                        r.tipo = req.body.tipo,
                        r.titulo = req.body.titulo
                        r.descricao = req.body.desc
                        r.subtitulo = req.body.subtitulo 
                        r.dataCriacao = req.body.dataCriacao 
                        r.visibilidade = req.body.visibilidade
                        r.hashtags = req.body.hashtags[0].split(',')
                        r.nome = nome
                        pub.recursoTitulo = req.body.titulo
                        pub.recursoDescricao = req.body.desc
                        pub.recursoTipo = req.body.tipo  
                    }
                    r.rating = 0
                    r.autor = u_email
                    r.autorID = id
                    pub.prodId = id,
                    pub.prodName = nome
                    console.log("r.autorID = " + r.autorID)
                
                    // --------------- Faz POST do recurso -------------

                    axios.post('http://localhost:7777/recurso?token='+token,r)
                        .then(data => {
                            var id = data.data.message;
                            console.log("Recurso registado na base de dados!")
                            var files = jsonfile.readFileSync(path.resolve(__dirname, '../dbFiles.json'))
                            var d = new Date().toISOString().substring(0,16)

                            if(n > 1){
                                files.push({
                                    date: d,
                                    name: f.originalname,
                                    desc: req.body.desc[idx],
                                    tipo: req.body.tipo[idx],
                                    ext: ext,
                                    nome: nome,
                                    id: id
                                })
                            }
                            else if(n == 1){
                                files.push({
                                    date: d,
                                    name: f.originalname,
                                    desc: req.body.desc,
                                    tipo: req.body.tipo,
                                    ext: ext,
                                    nome: nome,
                                    id: id
                                })
                            }
                            console.log(pub)
                            pub.recursoId = id
                            axios.post('http://localhost:7777/pub?token='+token,pub)
                            .then(data => console.log("Publicação criada!"))
                            .catch(err => console.log("Erro:"+err))    
                            jsonfile.writeFileSync(path.resolve(__dirname, '../dbFiles.json'),files)
                        })
                        .catch(err => console.log("Erro:"+err))
                    
         


                    // -------------------- Faz unzip --------------------

                    var zip = new AdmZip(filePath);
                    var zipEntries = zip.getEntries();
                    var meta_dados = [];
                    zipEntries.forEach(function(zipEntry) {
                        meta_dados.push(zipEntry.toString());
                    });

                    var folder_dest = filePath.split('.').slice(0, -1).join('.') + "/"
                
                    // Extrai zip para uma pasta com o mesmo nome
                    zip.extractAllTo(folder_dest, true);
                    console.log("Zip extracted to: " + folder_dest)
                
                    // Apaga o zip
                    fs.unlink(filePath, function(err) {
                        if (err) throw err
                        else console.log("Successfully deleted the zip: " + filePath)
                    })
                }
                else{
                    console.log("Tem erros na validação do manifest!")
                    var entrou = false
                    fs.unlink(oldPath, function(){
                        console.log("Ficheiro na pasta upload apagado.")
                    });

                    if(pdf_pptx != 1){
                        erros.push("Segundo a nossa implementação, não se pode ter mais do que 1 pdf/pptx no zip.")
                        entrou = true
                    }
                    if(count != 1){
                        erros.push("Existem mais ficheiros para além da pasta data e do ficheiro manifest.json.")
                        entrou = true
                    }
                    if(manifest == ""){
                        erros.push("Manifesto não está presente no zip.")
                        entrou = true
                    }
                    if(found == false){
                        erros.push("Pasta data não está presente no zip.")
                        entrou = true
                    }
                    if(entrou == false){
                        if(JSON.parse(manifest).ficheiros.length <= 10) // Só para a mensagem de erro não ser demasiado grande
                            erros.push("Foram encontrados erros no manifest no ficheiro: " + f.originalname + "\nO manifesto contém {" + JSON.parse(manifest).ficheiros + "}, e os ficheiros dentro do zip são {" + meta_dados2 + "}. Se ambos os arrays têm os mesmos elementos é porque o número de ficheiros é inválido para o tipo de recurso escolhido.")
                        else
                        erros.push("Foram encontrados erros no manifest no ficheiro: " + f.originalname + "\nO manifesto contém " + JSON.parse(manifest).ficheiros.length + " elementos e o zip contém " + meta_dados2.length + " elementos. Se ambos os arrays têm os mesmos elementos é porque o número de ficheiros é inválido para o tipo de recurso escolhido.")
                    }
                }
            })
            if(erros.length > 0)
                res.render('error', {message:"Erro no upload", error: erros})
            else
                res.redirect('/perfil')
        })    
})

function verifyToken(req,res,next) {
    jwt.verify(req.cookies.token, process.env.SECRET, function(err, decoded) {
      if (err){
        res.cookie('auth', "2", { 
          expires: new Date(Date.now() + '1d'),
          secure: false, // set to true if your using https
          httpOnly: true
          }); 
          res.redirect("/")
      }
      else{
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      req.nivel = decoded.nivel;
      next()
      }
    })
}

module.exports = router;