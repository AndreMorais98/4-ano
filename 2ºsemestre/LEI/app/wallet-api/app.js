var createError = require('http-errors');
var express = require('express');
var path = require('path');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')


var indexRouter = require('./routes/index');


var app = express();

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  if(req.originalUrl != "/login" && req.originalUrl != "/registar"){
    const token = req.query.token;
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, "segredo", function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.pkey = decoded.pkey
      next();
    })
  }
  else next()
});


app.use('/', indexRouter);


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
