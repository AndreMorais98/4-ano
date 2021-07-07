var http = require('http')
var url = require('url')
var fs = require('fs')

http.createServer(function (req,res){
  console.log(req.method + " " + req.url + " ")
  var size = req.url.split("/").length
  var split = req.url.split("/")[2]
  var num =/[0-9]+/.exec(split)
  //console.log("Num: " + num)

  if(size==3 && req.url.split("/")[1]=="arqs" &&parseInt(num) < 122 ){
    fs.readFile('./arqs/arq' + num + '.html',function(err,data) {
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.write(data)
      res.end()
    })
  }
  else if(split=="index.html"){
        fs.readFile('./arqs/index.html',function(err,data){
            res.writeHead(200,{'Content-Type':'text/html'})
            res.write(data)
            res.end()
        })
    
    }else{
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write("<p>URL não corresponde ao esperado.</p>")
        res.end()
    }
}).listen(7777)