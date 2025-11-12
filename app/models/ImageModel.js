const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let imageBase64Schema = new Schema({
    _id:{ type: String},    
    imageBase64: { type: String}
   
});

module.exports = mongoose.model("imageBase64", imageBase64Schema,"imageBase64");