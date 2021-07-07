var express = require("express");
var router = express.Router();
var Certificate = require("../models/certificate");
const jwt = require("jsonwebtoken");
const User = require("../controllers/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var axios = require("axios");
require("dotenv-safe").config();
const { exec } = require("child_process");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
let resolve = require("path").resolve;
const { NodeSSH } = require("node-ssh");
const fs = require("fs");

const CA_API = "https://10.0.0.101:8443/ca/rest/";

const config = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  auth: { username: process.env.USERNAMECA, password: process.env.PASSWORD },
};

function addUser(user) {
  var data = {
    id: user.id,
    UserID: user.UserID,
    FullName: user.FullName,
    Link: {
      rel: "self",
      href: "https://10.0.0.101:8443/ca/rest/admin/users/" + user.id,
      type: "application/json",
    },
    Attributes: {
      Attribute: [],
    },
  };

  axios
    .post(CA_API + "admin/users", data, config)
    .then((dat) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
}

/* Regista um utilizador */
router.post("/registar", (req, res) => {
  var user = req.body;
  bcrypt.hash(req.body.password, saltRounds).then((hash) => {
    user.password = hash;
    User.insert(user)
      .then((data) => {
        var u = {
          id: data._id,
          UserID: data._id,
          FullName: user.email,
        };
        addUser(u);
        res.status(200).json({ auth: "True" });
      })
      .catch((err) => {
        console.error("Erro na rota /registar: " + err);
        res
          .status(404)
          .json({ data: "False", message: "Falha ao registar utlizador!" });
      });
  });
});

/* Autenticação utilizador e geração de token para a sessão */
router.post("/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  User.lookup(email)
    .then((data) => {
      if (data.email == email) {
        bcrypt.compare(password, data.password).then(function (result) {
          if (result) {
            var id = data.email;
            const token = jwt.sign({ id }, process.env.SECRET, {
              expiresIn: 1800, // expires in 30min
            });
            return res.json({ auth: true, token: token });
          } else {
            res.status(500).json({ message: "Login inválido!" }); // erro no email/password
          }
        });
      } else res.status(500).json({ message: "Login inválido!" }); // erro no email/password
    })
    .catch((err) => res.status(500).json({ message: "Login inválido!" + err })); // erro no lookup
});

/* Criar um certificado*/
router.post("/certificate", async (req, res, next) => {
  var cert = Certificate.create(
    req.body.pass,
    req.body.tipo,
    req.body.size,
    req.body.uid,
    req.body.email,
    req.body.name,
    req.body.org3,
    req.body.org2,
    req.body.org1,
    req.body.org,
    req.body.o,
    req.body.country,
    req.body.req_name,
    req.body.req_email,
    req.body.req_phone
  );

  var cert_slice = cert.slice(1, -1);

  var id = await axios
    .post(CA_API + "certrequests", cert_slice, config)
    .then((data) => {
      var x = data.data.entries[0];
      var array = x.requestURL.split("/");
      return array[array.length - 1];
    })
    .catch((err) => {
      console.log("erro");
      console.log(err);
    });
  const ssh = new NodeSSH();

  ssh
    .connect({
      host: process.env.PKI_HOST,
      username: process.env.PKI_USERNAME,
      privateKey: "/home/tiago/.ssh/fed_rsa",
    })
    .then(function () {
      // Command
      ssh
        .execCommand("yes | sudo pki -n caadmin ca-cert-request-approve " + id)
        .then(function (result) {
          var myRe = new RegExp("Certificate ID: .*", "g");
          var stringMatch = myRe.exec(result.stdout)[0];
          var certId = stringMatch.slice(16);
          var u_id = req.userId; // retira id do token
          User.insertCert(certId, u_id)
            .then((data) => {
              res.status(200).json({ message: "Certificado criado!" });
            })
            .catch((err) => {
              console.error(err);
              res.status(501).json({ message: "Erro!" });
            });
        });
    });
});
/* Lista de certificado*/
router.get("/certificado/:id", (req, res, next) => {
  var id = req.params.id;
  var email = req.userId;
  User.checkCertAcess(email, id)
    .then((data) => {
      if (data.certs == undefined) {
        res.status(501).json({ message: "Nao autorizado!" });
      } else {
        axios
          .get("https://10.0.0.101:8443/ca/rest/certs/" + id, config)
          .then((dat) => {
            res.status(200).json({ data: dat.data });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(501).json({ message: "Nao autorizado!" });
    });
});

/* Lista de certificado*/
router.get("/certificados", async (req, res, next) => {
  var certs = [];
  var email = req.userId;
  try {
    var user = await User.lookup(email);
  } catch (ex) {
    console.error(ex);
  }
  var certificados = user.certs;

  for (let item of certificados) {
    await axios
      .get("https://10.0.0.101:8443/ca/rest/certs/" + item, config)
      .then((data) => {
        var elem = {
          serial_number: data.data.id,
          status: data.data.Status,
          sn: data.data.SubjectDN,
        };
        certs.push(elem);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  res.status(200).json({ data: certs });
});

/* Obter crl */
router.post("/crl", async (req, res, next) => {
  var method = req.body.method;
  const configfile = {
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/octet-stream",
      Accept: "application/json",
    },
    auth: { username: process.env.USERNAMECA, password: process.env.PASSWORD },
  };

  var path = resolve("../pec-api/public/MasterCRL.crl");
  await axios
    .get(
      "https://10.0.0.101:8443/" +
        "ca/ee/ca/getCRL?op=getCRL&crlIssuingPoint=MasterCRL",
      configfile
    )
    .then((dat) => {
      fs.writeFileSync(path, dat.data);
      return dat.data;
    })
    .catch((err) => {
      console.error(err);
      return res.status(501).json({ erro: "error" });
    });

  if (method == "display") {
    exec(
      " openssl crl -in " + path + " -inform DER -noout -text",
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        return res.status(200).json({ data: stdout });
      }
    );
  } else if (method == "download") {
    res.download(path);
  } else {
    return res.status(501).json({ erro: "post body incorreto" });
  }
});

/* OCSP Service*/
router.post("/ocsp", (req, res, next) => {
  var sn = req.body.sn;
  const ssh = new NodeSSH();
  ssh
    .connect({
      host: process.env.PKI_HOST,
      username: process.env.PKI_USERNAME,
      privateKey: "/home/tiago/.ssh/fed_rsa",
    })
    .then(function () {
      // Command
      ssh
        .execCommand(
          "sudo OCSPClient -d /etc/pki/pki-tomcat/alias -h 10.0.0.101 -p 8080 -t /ocsp/ee/ocsp -c ca_signing --serial " +
            sn
        )
        .then(function (result) {
          if (result.stderr) {
            return res.status(200).json({ data: "SN nao encontrado" });
          } else if (result.stdout) {
            return res.status(200).json({ data: result.stdout });
          } else {
            return res.status(501).json({ data: "Erro" });
          }
        });
    });
});

module.exports = router;
