const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ExpoSchema = new Schema({
    title:{type: String},
    paragraphes:[{type: String}],
    tableauAffiche: {type: Schema.Types.String, ref: "Tableau"},
    tableauxOrder: [{type: String}],
    lieu: {type: String},
    date: {type: String}

   
});

module.exports = mongoose.model("Expo", ExpoSchema,"Expo");