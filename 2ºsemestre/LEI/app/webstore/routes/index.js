var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var path = require("path");
var fs = require("fs");
var jwt_decode = require("jwt-decode");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
resolve = require("path").resolve;
var moment = require("moment");
const axios = require("axios");
var jsonfile = require("jsonfile");

var ngrok = "http://10.0.0.2:8500";

class Certificado {
  constructor() {
    this.$schema =
      "https://cert.arianee.org/version1/ArianeeProductCertificate-i18n.json";
    this.name = "";
    this.sku = "";
    this.gtin = "";
    this.brandInternalId = "";
    this.category = "";
    this.intended = "";
    this.serialnumber = [];
    this.subBrand = "";
    this.model = "";
    this.language = "Portuguese";
    this.description = "";
    this.msrp = [];
    this.medias = [];
    this.attributes = [];
    this.materials = [];
    this.size = [];
    this.manufacturingCountry = "";
    this.facilityId = "";
    this.productCertification = [];
  }
}

class Evento {
  constructor() {
    this.$schema =
      "https://cert.arianee.org/version1/ArianeeProductCertificate-i18n.json";
    (this.id = ""), (this.title = "");
    this.description = "";
    this.type = "";
    this.attributes = [];
    this.valuePrice = "";
    this.location = "";
  }
}

class Notificacao {
  constructor() {
    this.$schema =
      "https://cert.arianee.org/version1/ArianeeMessage-i18nAlpha.json";
    this.title = "";
    this.description = "";
    this.link = "";
  }
}

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Luxy Website" });
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Luxy Website" });
});

router.post("/login", (req, res) => {
  var pkey = req.body.pkey;
  console.log(req.body);
  console.log(pkey);
  axios
    .post("http://localhost:8500/login", { pkey: pkey })
    .then((dados) => {
      console.log(dados);
      res.cookie("token", dados.data.token, {
        expires: new Date(Date.now() + "1d"),
        secure: false, // set to true if your using https
        httpOnly: true,
      });
      {
        res.redirect("/store");
      }
    })
    .catch((err) => res.render("login", { err: "1" }));
});

router.get("/store", verifyToken, function (req, res) {
  res.render("store", { title: "Luxy Website" });
});

router.get("/certificado", verifyToken, function (req, res) {
  res.render("certificado", { title: "Luxy Website" });
});

router.get("/certificado/ouro", verifyToken, function (req, res) {
  res.render("ouro", { title: "Luxy Website" });
});

router.get("/certificado/roupa", verifyToken, function (req, res) {
  res.render("roupa", { title: "Luxy Website" });
});

router.get("/evento", verifyToken, function (req, res) {
  res.render("evento", { title: "Luxy Website" });
});

router.get("/evento/ouro", verifyToken, function (req, res) {
  res.render("eventouro", { title: "Luxy Website" });
});

router.get("/evento/roupa", verifyToken, function (req, res) {
  res.render("eventoroupa", { title: "Luxy Website" });
});

router.get("/notificacao", verifyToken, function (req, res) {
  res.render("notificacao", { title: "Luxy Website" });
});

function verifyToken(req, res, next) {
  jwt.verify(req.cookies.token, "segredo", function (err, decoded) {
    if (err) {
      res.redirect("/error");
    } else {
      // se tudo estiver ok, salva no request para uso posterior
      req.pkey = decoded.pkey;
      next();
    }
  });
}
router.post("/message", function (req, res) {
  var fileName = req.body.messageId;

  path = resolve("../webstore/public/mess/" + fileName + ".json");

  fs.writeFile(path, JSON.stringify(req.body.content), (err) => {
    if (err) throw err;
    res.status(200).json({ reason: "good" });
  });
});

router.post("/cert", function (req, res) {
  var fileName = req.body.params.certificateId;
  console.log(fileName);

  console.log(req.body.params.json);

  path = resolve("../webstore/public/cert/" + fileName + ".json");

  console.log(JSON.stringify(req.body.params.json));
  fs.writeFile(path, JSON.stringify(req.body.params.json), (err) => {
    if (err) throw err;
    res.status(200).json({ reason: "good" });
  });
});

router.post("/events", function (req, res) {
  console.log(req.body);
});

router.post("/rpc", function (req, res) {
  console.log(req.body);
  method = req.body.method;
  if (method == "event.create") {
    var eventId = req.body.params.eventId;
    console.log(eventId);

    path = resolve("../webstore/public/events/" + eventId + ".json");

    fs.writeFile(path, JSON.stringify(req.body.params.json), (err) => {
      if (err) throw err;
      res.status(200).json({ reason: "good" });
    });
  } else if (method == "certificate.create") {
    var fileName = req.body.params.certificateId;
    console.log(fileName);

    console.log(req.body.params.json);

    //path = path.resolve(__dirname, "../") + "/public/cert/" + fileName + ".json";
    //console.log(path);
    path = resolve("../webstore/public/cert/" + fileName + ".json");

    console.log(JSON.stringify(req.body.params.json));
    fs.writeFile(path, JSON.stringify(req.body.params.json), (err) => {
      if (err) throw err;
      res.status(200).json({ reason: "good" });
    });
  }
});

router.get("/cert/:name", function (req, res) {
  var fileName = req.params.name;
  var file = path.normalize(__dirname + "/" + fileName);
  console.log("path: " + file);

  jsonfile.readFile(file, function (err, obj) {
    if (err) {
      res.json({ status: "error", reason: err.toString() });
      return;
    }

    res.json(obj);
  });
});

router.post("/files/ouro", upload.array("myFile"), function (req, res) {
  console.log(req.files);
  key = jwt_decode(req.cookies.token).pkey;
  console.log("!1");
  var c = new Certificado();
  console.log("!1.2");
  c.name = req.body.nome;
  console.log("!12");
  c.sku = "";
  c.gtin = "";
  c.brandInternalId = "";
  c.category = "object";
  c.intended = "";

  c.serialnumber.push({
    type: "serialnumber",
    value: req.body.numero_serie,
  });

  c.subBrand = "";
  c.model = "";
  c.language = "Portuguese";
  c.description = req.body.descricao;

  c.attributes.push(
    {
      type: "color",
      value: "Gold",
    },
    {
      type: "year",
      value: req.body.ano,
    }
  );

  c.materials.push({
    material: "gold",
    pourcentage: req.body.pureza,
  });

  c.size.push({
    type: "weigth",
    value: req.body.peso,
    unit: "kg",
  });

  c.manufacturingCountry = req.body.pais_fabricante;
  c.facilityId = "";

  for (const item of req.files) {
    let oldPath = resolve(__dirname, "../") + "/" + item.path;
    let newPath = resolve(__dirname, "../") + "/public/fileStore/";

    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath);
    }

    let filePath = newPath + item.originalname;

    fs.rename(oldPath, filePath, function (err) {
      if (err) throw err;
    });

    c.medias.push({
      mediaType: "picture",
      type: "product",
      url: ngrok + "/fileStore/" + item.originalname,
    });
  }

  path = resolve(__dirname, "../") + "/public/cert/" + c.name + ".json";
  fs.writeFile(path, JSON.stringify(c), (err) => {
    if (err) throw err;
  });

  res.render("loading", {
    token: req.cookies.token,
    pkey: key,
    c: JSON.stringify(c),
    name: c.name,
  });
});

router.post("/files/roupa", upload.array("myFile"), function (req, res) {
  console.log(req.files);
  key = jwt_decode(req.cookies.token).pkey;
  var c = new Certificado();

  c.name = req.body.nome;

  c.sku = "";

  c.gtin = "";
  c.brandInternalId = "";
  c.category = "accessory";
  c.intended = req.body.sexo;
  c.subBrand = req.body.marca;
  c.model = "";
  c.language = "Portuguese";
  c.description = req.body.descricao;

  c.attributes.push({
    type: "type",
    value: req.body.peca,
  });

  c.materials.push({
    material: req.body.composicao,
    pourcentage: "",
  });

  c.size.push({
    type: "size",
    value: req.body.tamanho,
    unit: "EU",
  });

  c.manufacturingCountry = req.body.pais_fabricante;
  c.facilityId = "";

  for (const item of req.files) {
    let oldPath = resolve(__dirname, "../") + "/" + item.path;
    let newPath = resolve(__dirname, "../") + "/public/fileStore/";

    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath);
    }

    let filePath = newPath + item.originalname;

    fs.rename(oldPath, filePath, function (err) {
      if (err) throw err;
    });

    c.medias.push({
      mediaType: "picture",
      type: "product",
      url: ngrok + "/fileStore/" + item.originalname,
    });
  }

  console.log("3");
  console.log(c);
  path = resolve(__dirname, "../") + "/public/cert/" + c.name + ".json";
  console.log(JSON.stringify(c));

  fs.writeFile(path, JSON.stringify(c), (err) => {
    if (err) throw err;
  });
  console.log("4");

  res.render("loading", {
    token: req.cookies.token,
    pkey: key,
    c: JSON.stringify(c),
    name: c.name,
  });
});

router.post("/evento/ouro", function (req, res) {
  key = jwt_decode(req.cookies.token).pkey;
  var e = new Evento();

  (e.id = req.body.id),
    (e.title = req.body.titulo),
    (e.description = req.body.descricao),
    (e.type = "object"),
    e.attributes.push({
      value: req.body.preco,
      date: moment(new Date(Date.now())).format("YYYY-MM-DD hh:mm:ss"),
    }),
    (e.valuePrice = req.body.preco_ser),
    (e.location = req.body.localizacao);

  path = resolve(__dirname, "../") + "/public/events/" + e.title + ".json";
  fs.writeFile(path, JSON.stringify(e), (err) => {
    if (err) throw err;
  });
  console.log(JSON.stringify(e));
  res.render("loadingEve", {
    token: req.cookies.token,
    pkey: key,
    e: JSON.stringify(e),
  });
});

router.post("/evento/roupa", function (req, res) {
  key = jwt_decode(req.cookies.token).pkey;

  var e = new Evento();
  (e.id = req.body.id),
    (e.title = req.body.titulo),
    (e.description = req.body.descricao),
    (e.type = req.body.peca),
    e.attributes.push({
      value: req.body.preco,
      date: moment(new Date(Date.now())).format("YYYY-MM-DD hh:mm:ss"),
    }),
    (e.valuePrice = req.body.preco_ser),
    (e.location = req.body.localizacao);

  path = resolve(__dirname, "../") + "/public/events/" + e.title + ".json";
  fs.writeFile(path, JSON.stringify(e), (err) => {
    if (err) throw err;
  });
  console.log(JSON.stringify(e));
  res.render("loadingEve", {
    token: req.cookies.token,
    pkey: key,
    e: JSON.stringify(e),
    certificateId: e.id,
  });
});

router.post("/notificacao", function (req, res) {
  token = req.cookies.token;
  key = jwt_decode(req.cookies.token).pkey;
  var n = new Notificacao();

  (n.title = req.body.titulo),
    (n.description = req.body.descricao),
    (n.link = req.body.link);

  console.log(JSON.stringify(n));
  res.render("loadingNot", {
    token: req.cookies.token,
    pkey: key,
    n: JSON.stringify(n),
  });
});

module.exports = router;
