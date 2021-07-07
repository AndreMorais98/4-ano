const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  password: String,
  certs: [String],
});

module.exports = mongoose.model("user", userSchema);
