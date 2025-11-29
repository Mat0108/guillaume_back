const Tableau = require("../models/TableauModel");
const imageBase64 = require("../models/ImageModel");
const sharp = require("sharp");
exports.getAllTableaux = async (req,res)=>{
    const { page = 1, limit = 10 } = req.body;
    try {
      const [tableaux, total] = await Promise.all([
        Tableau.find().populate("imageBase64")
          .skip((page - 1) * limit)
          .limit(limit),
        Tableau.countDocuments(),
      ]);

      res.status(200).json({
        total,
        page,
        limit,
        tableaux,
      });
    } catch (error) {
      console.error("Erreur pagination :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des tableaux" });
    }
}

exports.getTableauById = (req,res) =>{
    Tableau.findById({_id:req.params.tableauId}).populate("imageBase64").exec((error, tableau) => {
        if (error) {
            res.status(401);
            res.json({message:"Impossible de récupérer le tableau"})
        }
        else {
            res.status(200);
            res.json(tableau);
        }
    })
}


exports.getTableauxByExpo = async (req, res) => {
    const { expoId, page = 1, limit = 10 } = req.body;
    try {
      const [tableaux, total] = await Promise.all([
        Tableau.find({ expos: expoId }).populate("imageBase64")
          .skip((page - 1) * limit)
          .limit(limit),
        Tableau.countDocuments({ expos: expoId }),
      ]);

      res.status(200).json({
        total,
        page,
        limit,
        tableaux,
      });
    } catch (error) {
      console.error("Erreur pagination :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des tableaux" });
    }
};

exports.createTableau = (req,res) => {
    
    let newTableau = new Tableau({
      titre:req.body.titre,
      dim_oeuvre:req.body.dim_oeuvre,
      dim_cadre:req.body.dim_cadre,
      technique: req.body.technique,
      prix: req.body.prix,
      date: req.body.date,
      expos: req.body.expos});
    newTableau.save(async (error, tableau) => {
        if (error) {
            res.status(401);
            res.json({message:"Impossible de créer un tableau"})
        }
        else {
            res.status(200);
            let newImage = new imageBase64({_id:`${tableau._id}-image`,imageBase64: `data:image/jpeg;base64,${previewBuffer.toString("base64")}`}) 
            newImage.save((error,image)=>{
              if(error){                
                res.status(401);
                res.json({message:"Impossible de créer un tableau"})
              }else{
                Tableau.findByIdAndUpdate(tableau._id,{imageBase64:image._id},(error,Tableau2)=>{
                  if(error){                
                    res.status(401);
                    res.json({message:"Impossible de créer un tableau"})
                  }else{
                    res.json({message:"Le tableau a bien été crée",tableau});
                  }
                })
              }
            })

            

        }
    })
}
function removeExtension(filename) {
  return filename.replace(/\.[^/.]+$/, ""); // enlève tout après le dernier point
}

exports.addMultipleImage = async (req,res) => {
     try {
    if (!req.files?.length) {
      return res.status(400).send("Aucun fichier envoyé");
    }

    const results = [];

    for (const file of req.files) {
        const { originalName, buffer, mimetype } = file;

        // Génération version réduite
        const previewBuffer = await sharp(buffer)
          .rotate() 
          .resize({ width: 1920, withoutEnlargement: true })
          .toFormat('jpeg', { quality: 90 }) // ✅ compatible tous formats
          .toBuffer();

        // Sauvegarde image réduite
        const imageId = `${removeExtension(originalName)}-image`;

        const image = await imageBase64.findByIdAndUpdate(
          imageId,
          {
            _id: imageId,
            imageBase64: `data:image/jpeg;base64,${previewBuffer.toString("base64")}`,
          },
          { upsert: true, new: true }
        );

        // Lien vers le tableau correspondant
        const tableau = await Tableau.findByIdAndUpdate(
          removeExtension(originalName),
          {
            _id: removeExtension(originalName),
            imageBase64: image._id,
          },
          { upsert: true, new: true }
        );

        // Ajout au résultat final
        results.push({
          filename: tableau._id,
          status: "ok",
          size: {
            preview: `${(previewBuffer.length / 1024 / 1024).toFixed(2)} Mo`,
          },
        });
      }

      res.json({ message: "Upload terminé", results });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

exports.getImage = (req,res) => {
  Tableau.findById(req.params.tableauId).populate("imageBase64").select("imageBase64").exec((error,tableau)=>{
        if (error) {
            res.status(401);
            res.json({message:"Impossible de récupérer les images du tableau"})
        }
        else {
            res.status(200);
            res.json(tableau);
        }
  })
}

exports.addExpo = async(req,res)=>{

    if (!req.params.tableauId || !req.body.expo) {
    return res.status(400).json({ message: "tableauId et expo sont requis" });
  }

  try {
    const tableau = await Tableau.findByIdAndUpdate(
      req.params.tableauId,
      { $addToSet: { expos: req.body.expo } }, // ajoute expo seulement si pas déjà présent
      { new: true } // renvoie le document mis à jour
    );

    if (!tableau) {
      return res.status(404).json({ message: "Tableau non trouvé" });
    }

    res.status(200).json({ message: "Expo ajoutée", tableau });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'expo" });
  }
}

exports.counts = async (req, res) => {
    try {
        const count = await (req.body.expoId 
            ? Tableau.countDocuments({ expos: req.body.expoId }) 
            : Tableau.countDocuments());
        res.status(200).json({ total: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTableau = (req,res) => {
   Tableau.findByIdAndUpdate(req.params.tableauId,req.body).populate("imageBase64").exec((error,tableau)=>{
        if (error) {
            res.status(401);
            res.json({message:"Impossible de récupérer les images du tableau"})
        }
        else {
            res.status(200);
            res.json(tableau);
        }
  })
}

exports.rotateTableau = (req,res) => {
  imageBase64.findById(`${req.params.tableauId}-image`).exec(async (error,image)=>{
        if (error) {
            res.status(401);
            res.json({message:"Impossible de récupérer les images du tableau"})
        }
        else {
          const rotatedBuffer = await sharp(Buffer.from(image.imageBase64.replace(/^data:.+;base64,/, ""),"base64")).rotate(req.body.angle ?? 90).toBuffer();
          imageBase64.findByIdAndUpdate(`${req.params.tableauId}-image`,{imageBase64:`data:image/jpeg;base64,${rotatedBuffer.toString("base64")}`}).exec((error,image)=>{
        if (error) {
            res.status(401);
            res.json({message:"Impossible de récupérer les images du tableau"})
        }
        else {
            res.status(200);
            res.json({imageBase64:`data:image/jpeg;base64,${rotatedBuffer.toString("base64")}`});
        }
  })
        }
  })
}
exports.updateTableauImage = async (req,res) => {
  const {originalName, buffer } = req.file;

        
        // Génération version réduite
  const previewBuffer = await sharp(buffer)
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .toFormat('jpeg', { quality: 90 }) // ✅ compatible tous formats
    .toBuffer();
    imageBase64.findByIdAndUpdate(`${req.params.tableauId}-image`,{imageBase64:`data:image/jpeg;base64,${previewBuffer.toString("base64")}`},(error,image)=>{
      if (error) {
          res.status(401);
          res.json({message:"Impossible de récupérer les images du tableau"})
      }
      else {
          res.status(200);
          res.json(image)
      }})
}

