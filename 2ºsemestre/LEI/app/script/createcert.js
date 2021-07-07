const ArianeeLib = require("@arianee/arianeejs");
let ar = new ArianeeLib.Arianee();
const fs = require("fs");
const fetch = require("node-fetch");
const Web3 = require("web3");
const identityABI = JSON.parse(
  fs.readFileSync("iden.json", { encoding: "utf8" })
);
const validator = " 0xCf260eA317555637C55F70e55dbA8D5ad8414Cb0";
async function loadWeb3() {
  identityContractAddress = "0x74a13bF9eFcD1845E5A2e932849094585AA3BCF9";

  const web3 = new Web3("https://sokol.poa.network");

  web3.eth.getBlockNumber().then((result) => {
    console.log("Latest Ethereum Block is ", result);
  });

  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  var identityContract = new web3.eth.Contract(
    identityABI,
    identityContractAddress
  );
  /*identityContract = await web3.eth
    .Contract(identityABI, "0x74a13bF9eFcD1845E5A2e932849094585AA3BCF9")
    .then((i) => {
      console.log("contraact");
      return i;
    })
    .catch((i) => console.log("Fail da rede2"));

*/

  await identityContract.methods.addAddressToApprovedList(
    "0x1D69aa6F9844e9357f7400525B8C46D216A8055a"
  );

  const isApproved = await identityContract.methods.addressIsApproved(
    "0x1D69aa6F9844e9357f7400525B8C46D216A8055a"
  );

  console.log(isApproved);

  const pkey =
    "0x7759e5cdf3e093cb8cc2d8c4b7a1d1d55d5d847866268a85a9e7dbb60fd01d3f";

  var arianee = await ar
    .init()
    .then((i) => {
      console.log("Ligando à rede");
      return i;
    })
    .catch((i) => console.log("Fail da rede"));

  wallet = arianee.fromPrivateKey(pkey);
  await wallet.methods
    .getIdentity("0x1D69aa6F9844e9357f7400525B8C46D216A8055a")
    .then((data) => {
      console.log(data);
    })
    .catch((i) => console.log(i));
}

async function process() {
  const pkey =
    "0x7759e5cdf3e093cb8cc2d8c4b7a1d1d55d5d847866268a85a9e7dbb60fd01d3f";
  var certificateUrl = "https://cert.arianee.org/cert/sampleCert.json";
  var arianee = await ar
    .init()
    .then((i) => {
      console.log("Ligando à rede");
      return i;
    })
    .catch((i) => console.log("Fail da rede"));

  wallet = arianee.fromPrivateKey(pkey);

  // Getting POA token for Gas
  await wallet
    .requestPoa()
    .then((i) => console.log("Getting POA"))
    .catch((i) => console.log("Fail"));

  // Getting Aria
  await wallet
    .requestAria()
    .then((i) => console.log("Getting ARIA"))
    .catch((i) => console.log("Fail"));

  // Approve store contract to manage our Aria
  await wallet.methods
    .approveStore()
    .then((i) => console.log("Approve store"))
    .catch((i) => console.log("Fail"));

  // Buy certificate credits
  await wallet.methods
    .buyCredits("certificate", 5)
    .then((i) => console.log("Buying credits"))
    .catch((i) => console.log("Fail"));

  // Grab certificate content
  var certificate = await fetch(certificateUrl)
    .then((i) => {
      console.log("Fetched certificate");
      return i;
    })
    .catch((i) => console.log("Fail"));

  var content = await certificate
    .json()
    .then((i) => {
      console.log("Getting certificate content");
      return i;
    })
    .catch((i) => console.log("Fail"));
  var p = null;
  var t = null;
  // Create a certificate based on a self hosted json
  await wallet.methods
    .createCertificate({
      uri: certificateUrl,
      content: content,
    })
    .then((i) => {
      console.log("Creating certificate");
      certificateId = i.certificateId;
      passphrase = i.passphrase;
      console.log(certificateId);
      t = certificateId;
      console.log(i.passphrase);
      p = passphrase;
    })
    .catch((i) =>
      console.log("Creating certificate : error ", JSON.stringify(i))
    );

  certprop = await wallet.methods
    .getCertificate(t, p)
    .then((i) => {
      console.log("transformei");

      return i;
    })
    .catch(console.log("Fail"));
  console.log(certprop);
}

//process();
loadWeb3();
