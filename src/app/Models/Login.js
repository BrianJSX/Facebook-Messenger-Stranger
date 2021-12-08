const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Login = new Schema(
  {
    id: { type: String, unique: true },
    username: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("login", Login);