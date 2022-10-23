const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
  mail: { type: String, uniquie: true },
  username: { type: String },
  password: { type: String },
  friends: [{ type: mongoose.Schema.Types.Object, ref: "User" }],
});

module.exports = mongoose.model("User", userSchema);
