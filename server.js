
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
const path = require("path")
const app = express();
let version = "1.0.0";
// Middleware pour analyser les requêtes au format JSON
app.use(express.json());

// Middleware pour analyser les requêtes au format x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Configuration des options CORS en fonction de l'environnement
var corsOptionsProd = {
  origin: process.env.PROD_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
var corsOptionsDev = {
  origin: process.env.DEV_URL,
  optionsSuccessStatus: 200
}
var corsOptions = process.env.ENV_TYPE == "prod" ? corsOptionsProd : process.env.ENV_TYPE == "dev" ? corsOptionsDev : null
console.log('corsOptions : ', corsOptions)
app.use(cors(corsOptions));

// Connexion à la base de données MongoDB via Mongoose
const db = require("./app/models");
console.log('db : ', db.url)
async function connectWithRetry(maxRetries = 5, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Tentative de connexion à MongoDB (${i + 1}/${maxRetries})...`);
      await mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connecté à la base de données !");
      return;
    } catch (err) {
      console.log(`MongoDB non prêt, attente de ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error("Impossible de se connecter à MongoDB après plusieurs tentatives.");
  process.exit(1);
}

// Lancer la connexion
connectWithRetry();
// Import et configuration des routes de l'application
const expoRoute = require("./app/routes/ExpoRoute");
const tableauRoute = require("./app/routes/TableauRoute")
expoRoute(app, corsOptions);
tableauRoute(app,corsOptions)


app.get("/", (req, res) => {
  res.status(200)
  res.json({ message: `Bienvenue sur l'application Guillaume Barnabé : ${version}` });
});

// Configuration du port d'écoute du serveur
// const options = {
//   key: fs.readFileSync(path.join(__dirname, "localhost+2-key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "localhost+2.pem")),
// };

const PORT = process.env.NODE_DOCKER_PORT || 8080;
// https.createServer(options, app).listen(PORT, () => {
//   console.log("✅ Serveur HTTPS en route sur https://localhost:8080");
// });
app.listen(PORT)

module.exports= app