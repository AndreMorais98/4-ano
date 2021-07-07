var express = require('express')
var bodyParser = require('body-parser')
var templates = require('./html-template')
var jsonfile = require('jsonfile')
var fs = require('fs')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/',function(req,res){
    var d = new Date().toISOString().substring(0,16)
    var files = jsonfile.readFileSync('./dbFiles.json')
    res.writeHead(200,{'Content-type': 'text/html; charset=utf-8'})
    res.write(templates.fileList(files,d))
    res.end()
})

app.get('/files/upload',function(req,res){
    var d = new Date().toISOString().substring(0,16)
    res.writeHead(200,{'Content-type': 'text/html; charset=utf-8'})
    res.write(templates.fileForm(d))
    res.end()
})

app.get('/files/download/:fname',function(req,res){
    res.download(__dirname + "/public/fileStore/" + req.params.fname)
})

app.post('/files',upload.array('myFile'),function(req,res){

    req.files.forEach((f,idx) => {
        let oldPath = __dirname + '/' + f.path
        let newPath = __dirname + '/public/fileStore/' + f.originalname

        fs.rename(oldPath,newPath, function (err){
            if(err) throw err
        })

        var files = jsonfile.readFileSync('./dbFiles.json')
        var d = new Date().toISOString().substring(0,16)
        var n = req.files.length

        if(n > 1){
            files.push({
                date: d,
                name: f.originalname,
                mimetype: f.mimetype,
                size: f.size,
                desc: req.body.desc[idx]
            })
        }
        else if (n == 1){
            files.push({
                date: d,
                name: f.originalname,
                mimetype: f.mimetype,
                size: f.size,
                desc: req.body.desc
            })
        }
        jsonfile.writeFileSync('./dbFiles.json',files)
    })
    res.redirect('/')
})


app.listen(7702, () => console.log('Servidor à escuta na porta 7702...'))