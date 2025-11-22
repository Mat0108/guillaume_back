const Expo = require("../models/ExpoModel");
const Tableau = require("../models/TableauModel");

exports.getAllExpo = (req,res) =>{
    Expo.find({}).populate({path: 'tableauAffiche',populate: {path: 'imageBase64',model: 'imageBase64'}}).exec((error, expos) => {
        if (error) {
            res.status(401);
            res.json({message:"Impossible de récuperer les expos"})
        }
        else {
            res.status(200);
            res.json(expos);
        }
    })
}
exports.getExpo=(req,res)=>{
    Expo.findOne({title:req.body.expotitle}).populate('tableauAffiche').populate("imageBase64").exec((error,expo)=>{
        if(error){
            res.status(401);
            res.json({message:"Impossible de récuperer l'expo"})
        }else{
            res.status(200);
            res.json(expo);
        }
    })
}
exports.createExpo= async (req,res)=>{
    let tableau = await Tableau.findById(req.body.tableauAffiche)
    let newExpo = new Expo({...req.body,tableauAffiche:tableau._id});
    newExpo.save((error, expo) => {
        if (error) {
            res.status(401);
            res.json({message:"Impossible de créer l'expo"})
        }
        else {
            res.status(200);
            res.json({message:"L'expo a bien été crée",expo});
        }
    })
}
exports.addParagraphes = (req,res) =>{
    Expo.findOneAndUpdate({title:req.body.expotitle},{paragraphes:req.body.paragraphes},(error, expo) => {
        if (error) {
            res.status(401);
            res.json({message:"Impossible de modifier l'expo"})
        }
        else {
            res.status(200);
            res.json({message:"L'expo a bien été mise a jour",expo});
        }
    })
}

exports.addOrder = (req,res) => {
   Expo.findOneAndUpdate({title:req.body.expotitle},{tableauxOrder:req.body.tableauxOrder},(error, expo) => {
        if (error) {
            res.status(401);
            res.json({message:"Impossible de modifier l'expo"})
        }
        else {
            res.status(200);
            res.json({message:"L'expo a bien été mise a jour",expo});
        }
    })
}