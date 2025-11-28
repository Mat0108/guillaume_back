const Expo = require("../models/ExpoModel");

const sharp = require("sharp");
exports.getAllExpo = (req,res) =>{
    Expo.find({}).exec((error, expos) => {
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
    Expo.findOne({title:req.body.expotitle}).exec((error,expo)=>{
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
    let newExpo = new Expo({...req.body});
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

exports.updateExpo = (req,res) => {
    Expo.findByIdAndUpdate({_id:req.params.expoId},req.body,(error, expo) => {
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

exports.updateAffiche = async (req,res) => {
    const { buffer } = req.file;

   
    // Génération version réduite
    const previewbuffer = await sharp(buffer)
        .rotate() // corrige les métadonnées EXIF
        .resize({ width: 1920, withoutEnlargement: true })
        .toFormat('jpeg', { quality: 90 }) // ✅ compatible tous formats
        .toBuffer();
    Expo.findByIdAndUpdate({_id:req.params.expoId},{tableauAffiche:`data:image/jpeg;base64,${previewbuffer.toString("base64")}`,tableauAfficheRatio:req.body.tableauAfficheRatio},(error, expo) => {
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