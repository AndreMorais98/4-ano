var express = require("express");
var router = express.Router();
const ArianeeLib = require("@arianee/arianeejs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
var jwt_decode = require("jwt-decode");
const fetch = require("node-fetch");
var fs = require("fs");
var lineReader = require("readline");
let ar = new ArianeeLib.Arianee();
var moment = require("moment");
var ngrok = "http://58d3f6917d6b.ngrok.io";

/* GET home page. */
router.get("/login", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", (req, res) => {
  var pkey = req.body.pkey;
  ar.init()
    .then((data) => {
      wallet = data.fromPrivateKey(pkey);
      console.log(wallet.address);
      const token = jwt.sign({ pkey }, "segredo", {
        expiresIn: 3600, // expires in 1h
      });
      console.log(token);
      res.status(200).json({ message: "true", token: token });
    })
    .catch((err) => res.status(500).json({ message: "false" }));
});

/* Regista um utilizador retornando a private key para a sua conta */
router.get("/registar", (req, res) => {
  ar.init()
    .then((data) => {
      wallet = data.fromRandomKey();
      console.log(wallet.address);
      res.status(200).json({ message: wallet.privateKey });
    })
    .catch((err) => res.status(500).json({ message: err }));
});

router.post("/certificado", async function (req, res) {
  var token = req.query.token;
  key = jwt_decode(token).pkey;
  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(key);
  cc = req.body.content;

  await wallet.methods;
  var certificate = await fetch(ngrok + "/cert/" + req.body.name + ".json");
  var content = await certificate.json();

  id = 0;
  await wallet.methods
    .createAndStoreCertificate(
      {
        uri: ngrok + "/cert/" + req.body.name + ".json",
        content: content,
      },
      ngrok + "/rpc"
    )
    .then((i) => {
      console.log(i);
      console.log("Creating certificate");
      id = i.certificateId;
      pass = i.passphrase;
      fs.writeFile(
        "../wallet-api/db.txt",
        id.toString() + "\n",
        { flag: "a" },
        (err) => {
          if (err) {
            console.error(err);
          }
          res.status(200).json({ passphrase: pass, id: id });
          //done!
        }
      );
    })
    .catch((i) =>
      console.log("Creating certificate : error ", JSON.stringify(i))
    );
  console.log(id);
  /** 
  await wallet.methods
    .storeContentInRPCServer(id, content, ngrok +"/cert")
    .then((i) => {
      console.log("------------------------")
      console.log(id)
      console.log(pass)

      console.log("STORE");
      
    })
    .catch((i) =>
      console.log("Creating certificate : error ", JSON.stringify(i))
    );
    */
});

/* Devolve um array de productos de um utilizador */
router.get("/products", async (req, res) => {
  var token = req.query.token;
  pkey = jwt_decode(token).pkey;
  array = [];
  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(pkey);

  certs = await wallet.methods
    .getMyCertificates()
    .then((i) => {
      console.log("Getting my certificates");
      console.log(i.content);
      return i;
    })
    .catch((i) => console.log(i));

  for (const item of certs) {
    var certificate = await fetch(
      ngrok + "/cert/" + item.certificateId + ".json"
    );
    console.log("2");
    var content = await certificate.json();
    console.log("1");

    console.log(item.passphrase);
    array.push({ certificateId: item.certificateId, content: content });
  }

  res.status(200).json({ message: { title: "Meu produtos", data: array } });
});

router.post("/transfere", async (req, res) => {
  var token = req.query.token;
  id = req.body.certificateId;
  pass = req.body.passphrase;
  console.log(id);
  console.log(pass);
  pkey = jwt_decode(token).pkey;
  array = [];
  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(pkey);

  await wallet.methods
    .requestCertificateOwnership(id, pass)
    .then((i) => {
      res.status(200).json({ message: "Certificado transferido com sucesso" });
    })
    .catch((i) =>
      console.log("Requesting certificate : error ", JSON.stringify(i))
    );
});

router.post("/notificacao", async (req, res) => {
  var token = req.query.token;

  content = req.body.content;
  pkey = jwt_decode(token).pkey;

  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(pkey);

  var lineReader = require("readline").createInterface({
    input: require("fs").createReadStream("../wallet-api/db.txt"),
  });
  console.log(wallet.address);
  lineReader.on("line", async function (line) {
    console.log(line);
    var id = Number(line);
    console.log(id);

    console.log(id);
    const message = {
      certificateId: id,
      content: content,
    };
    console.log(content);

    const result = await wallet.methods
      .createMessage(message)
      .then((i) => {
        console.log("Creating message");
        console.log(i);
        return i;
      })
      .catch((i) => console.log("Getting certificates : error "));

    console.log(result);
    url = ngrok + "/message";
    console.log(typeof url);
    console.log(url);
    /*
    await wallet.methods.storeMessage(id, result.messageId,message.content,url).then((i) => {
      console.log("Storing message");
      return i;
    })
    .catch((i) => console.log(("Requesting certificate : error ", JSON.stringify(i))));
*/
    axios
      .post(url, { messageId: result.messageId, content: message.content })
      .then((dados) => {
        res.status(200).json({ id: "enviado!" });
      })
      .catch((err) => console.log("erro"));
  });
});
/* Get link para transferir*/
router.get("/qrcode/:id", async (req, res) => {
  console.log("ahahah");
  var token = req.query.token;
  pkey = jwt_decode(token).pkey;
  array = [];
  var id = req.params.id;
  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(pkey);

  result = await wallet.methods
    .createCertificateRequestOwnershipLink(id)
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((i) => console.log("Getting certificates : error "));

  res.status(200).json({ data: result.link });
});

/* Devolve eventos de um produto */
router.get("/events/:id", async (req, res) => {
  console.log("ahahah");
  var token = req.query.token;
  pkey = jwt_decode(token).pkey;
  array = [];
  var id = req.params.id;
  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(pkey);

  cert = await wallet.methods
    .getCertificate(id, {}, { events: true })
    .then((i) => {
      console.log(i);
      return i;
    })
    .catch((i) => console.log("Getting certificates : error "));

  const b = await wallet.methods.getCertificate(id, "", {
    events: true,
  });

  console.log(wallet.address);
  console.log(b);
  console.log(b.events);

  res.status(200).json({ message: cert });
});

router.post("/evento", async (req, res) => {
  var token = req.query.token;
  var cid = req.body.certificateId;
  var data_content = req.body.content;

  pkey = jwt_decode(token).pkey;

  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(pkey);
  console.log(data_content);

  try {
    certificateId = Number(cid);
    const event = {
      certificateId,
      content: data_content,
    };

    x = await wallet.methods
      .createAndStoreArianeeEvent(event, ngrok + "/rpc")
      .then((i) => {
        console.log(i);
        return i;
      })
      .catch((i) => console.log(i));

    console.log(arianeeEventId);
    res.status(200).json({ id: x.arianeeEventId });
  } catch (exception_var) {
    console.log(exception_var);
    res.status(501).json({ id: x.arianeeEventId });
  }
});

router.post("/eventoresp", async (req, res) => {
  var token = req.query.token;

  var resp = req.body.resp;
  var event_id = req.body.eventoId;
  console.log(event_id);
  pkey = jwt_decode(token).pkey;

  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(pkey);
  if (resp == "accept") {
    try {
      console.log("accept");
      const { arianeeEventId } = await wallet.methods.acceptArianeeEvent(
        event_id
      );
      console.log(arianeeEventId);
      res.status(200).json({ id: arianeeEventId });
    } catch (exception_var) {
      console.log("error");
    }
  } else {
    try {
      console.log("reject");
      const { arianeeEventId } = await wallet.methods.refuseArianeeEvent(
        event_id
      );
      res.status(200).json({ id: arianeeEventId });
    } catch (exception_var) {
      console.log("error");
    }
  }
});

/* Notificacoes de um utilizador */
router.get("/notificacoes", async (req, res) => {
  nots = [];
  var token = req.query.token;
  pkey = jwt_decode(token).pkey;
  array = [];
  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(pkey);

  msgs = await wallet.methods.getMyMessages();
  for (const item of msgs) {
    try {
      if (item.isRead == false) {
        var certificate = await fetch(
          ngrok + "/mess/" + item.messageId + ".json"
        );
        var content = await certificate.json();
        console.log(content);
        nots.push({
          id: item.messageId,
          content: content,
        });
      }
    } catch (exception_var) {
      console.log("error");
    }
  }
  console.log("Notificação Enviada");
  res.status(200).json({ data: nots });
});

/* Notificacoes de um utilizador */
router.post("/read", async (req, res) => {
  nots = [];
  console.log("reaaadddd");
  var token = req.query.token;
  pkey = jwt_decode(token).pkey;
  id = req.body.id;
  console.log(id);
  array = [];
  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(pkey);

  msgs = await wallet.methods.markAsRead(id);
  // s
  console.log("Notificação Enviada");
  res.status(200).json({ data: "yeyeye" });
});

/* Devolve eventos de um produto */
router.get("/history/:id", async (req, res) => {
  var token = req.query.token;
  pkey = jwt_decode(token).pkey;
  array = [];
  var id = req.params.id;
  var arianee = await new ar.init();
  wallet = arianee.fromPrivateKey(pkey);

  const b = await wallet.methods.getCertificate(id, "", {
    events: true,
  });

  console.log(b.events);
  count = 0;

  for (const item of b.events.transfer) {
    if (count == 0) {
      array.push({
        title: "Criação do passaporte do produto",
        description: "",
        time: moment(new Date(item.timestamp * 1000)).format("YYYY-MM-DD "),
      });
    } else {
      if (item.returnValues._to == wallet.address) {
        array.push({
          title: "Transferência do produto",
          description: "Recebeu o produto de: " + item.returnValues._from,
          time: moment(new Date(item.timestamp * 1000)).format("YYYY-MM-DD "),
        });
      } else {
        array.push({
          title: "Transferência do produto",
          description:
            "Transferência de: " +
            item.returnValues._from +
            " para: " +
            item.returnValues._to,
          time: moment(new Date(item.timestamp * 1000)).format("YYYY-MM-DD "),
        });
      }
    }
    count++;
  }

  res.status(200).json({ data: array });
});

module.exports = router;
