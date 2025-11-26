const Tableau = require("../models/TableauModel");
const imageBase64 = require("../models/ImageModel");
const sharp = require("sharp");
exports.getAllTableaux = async (req,res)=>{
    const { page = 1, limit = 10 } = req.body;
    try {
      const [tableaux, total] = await Promise.all([
        Tableau.find().populate("imageBase64")
          .skip((page - 1) * limit)
          .limit(limit)
          .select("-imageBase64Full"),
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
    Tableau.findById({_id:req.params.tableauid},(error, tableau) => {
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
    const { expo, page = 1, limit = 10 } = req.body;
    try {
      const [tableaux, total] = await Promise.all([
        Tableau.find({ expos: expo }).populate("imageBase64")
          .skip((page - 1) * limit)
          .limit(limit)
          .select("-imageBase64Full"),
        Tableau.countDocuments({ expos: expo }),
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
    let newTableau = new Tableau(req.body);
    newTableau.save((error, tableau) => {
        if (error) {
            res.status(401);
            res.json({message:"Impossible de créer un blog"})
        }
        else {
            res.status(200);
            res.json({message:"Le tableau a bien été crée",tableau});
        }
    })
}
function removeExtension(filename) {
  return filename.replace(/\.[^/.]+$/, ""); // enlève tout après le dernier point
}


exports.addImage = async (req,res)=>{
    if(!req.file){return res.status(404).send("Tableau non trouvé");}
    const { originalname, buffer, mimetype } = req.file;
    const tableau = await Tableau.findById(removeExtension(originalname));
    if (!tableau) return res.status(404).send("Tableau non trouvé");

    // 🔹 Version originale limitée à ~12 Mo (compression légère)
    const fullBuffer = await sharp(buffer)
        .jpeg({ quality: 95 }) // compresse légèrement sans perte visible
        .toBuffer();

    if (fullBuffer.length > 12 * 1024 * 1024)
        return res.status(400).send("Image trop lourde (>12 Mo)");


    const previewBuffer = await sharp(buffer)
        .resize({ width: 1920 }) // hauteur automatique
        .toBuffer();
        // .jpeg({ quality: 100 })

    tableau.imageBase64Full = `data:${mimetype};base64,${fullBuffer.toString("base64")}`;
    tableau.imageBase64 = `data:${mimetype};base64,${previewBuffer.toString("base64")}`;

    await tableau.save();
    res.json({ message: "Image enregistrée", id: tableau._id });
}
exports.addMultipleImage = async (req,res) => {
     try {
    if (!req.files?.length) {
      return res.status(400).send("Aucun fichier envoyé");
    }

    const results = [];

    for (const file of req.files) {
        const { originalname, buffer, mimetype } = file;

        console.log('File reçu :', originalname, mimetype, buffer.length);

        // Génération version réduite
        const previewBuffer = await sharp(buffer)
          .rotate() // corrige les métadonnées EXIF
          .resize({ width: 1920, withoutEnlargement: true })
          .toFormat('jpeg', { quality: 90 }) // ✅ compatible tous formats
          .toBuffer();

        // Sauvegarde image réduite
        const imageId = `${removeExtension(originalname)}-image`;

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
          removeExtension(originalname),
          {
            _id: removeExtension(originalname),
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
  Tableau.findById(req.params.tableauid).populate("imageBase64").select("imageBase64").exec((error,tableau)=>{
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

    if (!req.params.tableauid || !req.body.expo) {
    return res.status(400).json({ message: "tableauId et expo sont requis" });
  }

  try {
    const tableau = await Tableau.findByIdAndUpdate(
      req.params.tableauid,
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
        const count = await (req.body.expo 
            ? Tableau.countDocuments({ expos: req.body.expo }) 
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