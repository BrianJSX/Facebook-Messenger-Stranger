const mongoose = require("mongoose");
require("dotenv").config();
const url_mongo = process.env.URL_MONGO;

const connect = async () => {
  try {
    await mongoose.connect(url_mongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("connect mongo success");
  } catch (error) {
    console.log("connect error" + error);
  }
};

module.exports = { connect };
