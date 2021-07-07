var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var jwt = require("jsonwebtoken");
require("dotenv-safe").config();

// ----------------------------------------------------------------------------

//Import the mongoose module
var mongoose = require("mongoose");

//Set up default mongoose connection
var mongoDB = "mongodb://127.0.0.1/PEC";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error..."));
db.once("open", function () {
  console.log("Conexão ao MongoDB realizada com sucesso...");
});

// ----------------------------------------------------------------------------

let app = express(); // Compliant
app.disable("x-powered-by");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Midlleware para intercetar tokens
app.use(function (req, res, next) {
  // Ignorar necessidade de token destas rotas
  if (req.originalUrl != "/login" && req.originalUrl != "/registar") {
    // Autorização
    const token = req.query.token;
    if (!token)
      return res
        .status(401)
        .json({ auth: false, message: "No token provided." });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err)
        return res
          .status(500)
          .json({ auth: false, message: "Failed to authenticate token." });

      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
  } else next();
});

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).jsonp({ error: err.message });
});

module.exports = app;
