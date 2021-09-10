const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Room = new Schema(
  {
    p1: { type: String, unique: false, default: null},
    p2: { type: String, unique: false, default: null },
    gioitinh: { type: String, default: null }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("rooms", Room);
