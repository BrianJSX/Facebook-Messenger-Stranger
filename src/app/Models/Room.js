const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Room = new Schema(
  {
    p1: { type: String, unique: true },
    p2: { type: String, unique: true, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("rooms", Room);
