const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let tableauSchema = new Schema({
    _id:{ type: String},
    dim_oeuvre: { type: String},
    dim_cadre: { type: String},
    titre: { type: String},
    technique: { type: String},
    prix:{ type: String},
    expos:[{ type: String}],
    imageBase64: {type: Schema.Types.String, ref: "imageBase64"},
   
});

module.exports = mongoose.model("Tableau", tableauSchema,"Tableau");