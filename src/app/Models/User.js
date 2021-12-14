const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    messenger_id: { type: String, unique: true },
    state: { type: Number, default: 0 },
    block: [String]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", User);
