const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const History = new Schema(
  {
    p1: { type: String },
    p2: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("history", History);