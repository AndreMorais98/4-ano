var express = require('express');
var router = express.Router();

var Controller = require ('../controllers/controllers')

//GET dos hosts
router.get('/',function(req,res){
  data = Controller.host()
  res.render('index',{host: data})
})

//GET id
router.get("/:id/", function(req, res) {
  var id = req.params.id
  res.render ('choose', {id: id})
});

 
//GET lista de processos
router.get("/:id/ram", function(req,res){
  var host = req.params.id
  data = Controller.pidram(host)
  res.render ('procram', {pidr: data, id: host})
});

//GET lista de processos
router.get("/:id/cpu", function(req,res){
  var host = req.params.id
  data = Controller.pidcpu(host)
  res.render ('proccpu', {pidc: data, id: host})
});

//GET string do graph para a ram
router.get("/:id/ram/:pid", function(req,res){
  var pid = req.params.pid
  var host = req.params.id
  data = Controller.graphr(host,pid)
  //nomezao = Controller.nomeproc(host,pid)
  res.render ('graphram', {graph: JSON.stringify(data), id: host, pid: pid})
});

//GET string do graph para a cpu
router.get("/:id/cpu/:pid", function(req,res){
  var pid = req.params.pid
  var host = req.params.id
  data = Controller.graphc(host,pid)
  //nomezao = Controller.nomeproc(host,pid)
  res.render ('graphcpu', {graph: JSON.stringify(data), id: host, pid: pid})
});



module.exports = router;