var express = require('express');
var router = express.Router();
const Pub = require('../controllers/pub');
var moment = require('moment'); 

/* GET lista publicações */
router.get('/lista', function(req, res, next) {
    var limit = req.query.limit
    var page = req.query.page
    Pub.list(limit,page)
    .then(data => res.send(data))
    .catch(err => res.status(500).json({message: err}))
});

router.post('/', function(req, res, next) {
    var pub = req.body
    pub.dataCriacao = moment(new Date(Date.now())).format('YYYY-MM-DD hh:mm:ss')
    Pub.insert(pub)
    .then(data => res.status(200).json({message: data._id}))
    .catch(err => res.status(404).json({message: 'Publicação não inserido!'+ err})) 
});


module.exports = router;
