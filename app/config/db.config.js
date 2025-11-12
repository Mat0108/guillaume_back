// Charger la configuration des variables d'environnement à partir du fichier .env
require("dotenv").config();

// Exporter un objet contenant l'URL de la base de données MongoDB
module.exports = {
  // L'URL de la base de données est stockée dans la variable d'environnement MONGODB_URL
  // Cela permet de séparer les informations sensibles du code source
  url: process.env.MONGODB_URL
};
