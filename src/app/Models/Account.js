const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Account = new Schema(
  {
    messenger_id: { type: String, unique: true },
    username: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("account", Account);