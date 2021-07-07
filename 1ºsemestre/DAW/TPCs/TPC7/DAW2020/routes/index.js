var express = require('express');
var router = express.Router();

var Student = require('../controllers/student')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Base de Dados dos Alunos de Daw2020' });
});

router.get('/students', function(req, res) {
  Student.list()
    .then(data => res.render('students',{list: data}))
    .catch(err => res.render('error',{error: err}))
});

// get de um aluno
router.get(/\/students\/:[A|PG][0-9]+/, function(req, res) {
  var id = req.url.split(":")[1]
  Student.lookup(id)
    .then(stu => res.render('student',{student: stu}))
    .catch(err => res.render('error',{error: err}))
});


// Registar um aluno
router.get('/students/registar', function(req, res){
  res.render('regist',{title: 'Registo de Aluno'})
})

// Post de aluno
router.post('/students', function(req,res) {
  Student.insert(req)
  res.redirect('/students')
})

router.get(/\/students\/delete\/:[A|PG][0-9]+/, function(req, res) {
  var id = req.url.split(":")[1]
  Student.remove(id)
  res.redirect('/students')
});


// Editar um aluno
router.get(/\/students\/edit\/:[A|PG][0-9]+/, (req, res) => {
  var id = req.url.split(":")[1]
  Student.lookup(id)
    .then(data => res.render('edit',{student: data}))
    .catch(err => res.render('error', {error: err}))
})

// Put de aluno
router.post('/students/edit', (req,res)=>{
  Student.edit(req)
  console.log(req)
  res.redirect('/students')
})


router.get(/\/students\/delete\/:[0-9a-zA-Z]+/, (req,res)=>{
  var split = req.url.split(":")[1]
  Student.remove(split)
  res.redirect('/students')
})

module.exports = router;
