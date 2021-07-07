var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose')
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')
require("dotenv-safe").config()

// ----------------------------------------------------------------------------

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/PGR';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.once('open', function() {
    console.log("Conexão ao MongoDB realizada com sucesso...")
});

// ----------------------------------------------------------------------------
var usersRouter = require('./routes/users');
var recursosRouter = require('./routes/recurso');
var pubRouter = require('./routes/pub');
var commentRouter = require('./routes/comment');
var cors = require('cors')

var app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  // Autorização
    const token = req.query.token;
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      req.nivel = decoded.nivel;
      next();
    })
  });

app.use('/users', usersRouter);
app.use('/recurso', recursosRouter);
app.use('/pub', pubRouter);
app.use('/comment', commentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).jsonp({error: err.message})
 
});

module.exports = app;
