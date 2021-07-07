var express = require("express");
var router = express.Router();
var axios = require("axios");
var jwt_decode = require("jwt-decode");
var multer = require("multer");
var path = require("path");
var fs = require("fs");
const User = require("../models/user");
var jwt = require("jsonwebtoken");
var moment = require("moment");
require("dotenv-safe").config();
resolve = require("path").resolve;
var { randomBytes } = require("crypto");
/* GET home page. */
router.get("/", function (req, res) {
  console.log("asd");
  if (req.cookies.auth == "1") {
    res.cookie("auth", { expires: Date.now() });
    res.render("index", { err: "1", title: "PEC" });
  } else if (req.cookies.auth == "2") {
    res.cookie("auth", { expires: Date.now() });
    res.render("index", { err: "2", title: "PEC" });
  } else {
    console.log("aa");
    res.render("index", { err: "0", title: "PEC" });
  }
});

router.get("/registar", function (req, res, next) {
  res.render("registar");
});

router.get("/home", verifyToken, function (req, res, next) {
  res.render("home");
});

router.get("/certificate", verifyToken, function (req, res, next) {
  value = randomBytes(100).toString("base64");
  res.cookie("csrf", value); // convert random data to a string
  res.render("cert", { token: value });
});

router.get("/status", verifyToken, function (req, res, next) {
  res.render("status");
});

router.get("/list/certificate", verifyToken, function (req, res, next) {
  res.render("listcert", { token: req.cookies.token });
});

router.get("/certificado/:id", verifyToken, function (req, res, next) {
  id = req.params.id;
  token = req.cookies.token;
  axios
    .get("http://localhost:7779/certificado/" + id + "?token=" + token)
    .then((dados) => {
      console.log(dados.data.data.PrettyPrint);
      fst = dados.data.data.PrettyPrint;
      snd = dados.data.data.Encoded;
      trd = dados.data.data.PKCS7CertChain;
      res.render("certificado", { fst: fst, snd: snd, trd: trd });
    })
    .catch((err) => {
      res.render("error", { error: err });
    });
});

router.get("/crl", verifyToken, function (req, res, next) {
  res.render("crl");
});

router.get("/ocsp", verifyToken, function (req, res, next) {
  res.render("ocsp");
});

/* Criar um certificado*/
router.post("/certificate", async (req, res, next) => {
  cert = req.body;
  if (!req.body.csrf) {
    return res.render("error");
  }

  if (req.body.csrf !== req.cookies.csrf) {
    return res.render("error");
  }
  axios
    .post("http://localhost:7779/certificate?token=" + req.cookies.token, cert)
    .then((dados) => {
      res.redirect("/list/certificate");
    })
    .catch((err) => {
      res.render("error", { error: err });
    });
});

router.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var u = { email: email, password: password };
  axios
    .post("http://localhost:7779/login", u)
    .then((dados) => {
      console.log(dados);
      res.cookie("token", dados.data.token, {
        expires: new Date(Date.now() + "1d"),
        secure: false, // set to true if your using https
        httpOnly: true,
      });

      res.cookie("logout", { expires: Date.now() });
      res.cookie("auth", { expires: Date.now() });
      {
        res.redirect("/home");
      }
    })
    .catch((err) => {
      res.cookie("auth", "1", {
        expires: new Date(Date.now() + "1d"),
        secure: false, // set to true if your using https
        httpOnly: true,
      });
      res.redirect("/");
    });
});

/* POST utilizador */
router.post("/registar", function (req, res) {
  var u = new User(req.body);
  // regista utilizador
  axios
    .post("http://localhost:7779/registar", u)
    .then((data) => console.log("Registado"))
    .catch((err) => res.render("error", { error: err }));
  res.redirect("/");
});

router.get("/logout", verifyToken, function (req, res) {
  res.cookie("logout", "1", {
    expires: new Date(Date.now() + "1d"),
    secure: false, // set to true if your using https
    httpOnly: true,
  });
  res.cookie("token", { expires: Date.now() });
  res.redirect("/");
});

router.post("/crl", verifyToken, function (req, res) {
  method = req.body.choose;
  console.log(req.body);
  axios
    .post("http://localhost:7779/crl?token=" + req.cookies.token, {
      method: method,
    })
    .then((dados) => {
      if (method == "display") {
        console.log("display");
        res.render("crlcert", { cert: dados.data.data }); // página com crl
      } else if (method == "download") {
        res.redirect(
          "http://localhost:7779/MasterCRL.crl?token=" + req.cookies.token
        );
      } else {
        res.render("error", { error: err });
      }
    })
    .catch((err) => res.render("error", { error: err }));
});

router.post("/ocsp", verifyToken, function (req, res) {
  sn = req.body.sn;
  console.log(req.body);
  axios
    .post("http://localhost:7779/ocsp?token=" + req.cookies.token, {
      sn: sn,
    })
    .then((dados) => {
      res.render("status", { status: dados.data.data }); // página com crl
    })
    .catch((err) => res.render("error", { error: err }));
});

/* Logout */
router.get("/logout", verifyToken, function (req, res) {
  res.cookie("logout", "1", {
    expires: new Date(Date.now() + "1d"),
    secure: false, // set to true if your using https
    httpOnly: true,
  });
  res.cookie("token", { expires: Date.now() });
  res.redirect("/");
});

function verifyToken(req, res, next) {
  jwt.verify(req.cookies.token, process.env.SECRET, function (err, decoded) {
    if (err) {
      res.cookie("auth", "2", {
        expires: new Date(Date.now() + "1d"),
        secure: false, // set to true if your using https
        httpOnly: true,
      });
      console.log("AIAIAIAIAIAI");
      res.redirect("/");
    } else {
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    }
  });
}

module.exports = router;
