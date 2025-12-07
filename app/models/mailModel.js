const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = new Schema({
    name:{type: String},
    message:{type: String},
    date:{type:Date}
   
});

module.exports = mongoose.model("Message", messageSchema,"Message");