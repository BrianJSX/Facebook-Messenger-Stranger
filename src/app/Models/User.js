const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    messenger_id: String,
    state: Number
});

module.exports =  mongoose.model('users', User);