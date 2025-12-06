// const multer = require("multer")
module.exports = (server,corsConfig) => {
    const ExpoController = require("../controllers/ExpoController");
    const cors = require('cors');

    server.get("/expo/getAll", cors(corsConfig), ExpoController.getAllExpo);
    server.post("/expo/create",cors(corsConfig),ExpoController.createExpo);

    server.get("/expo/:expoId", cors(corsConfig),ExpoController.getExpo);
    server.post("/expo/:expoId/addParagraphes",cors(corsConfig),ExpoController.addParagraphes);
    server.post("/expo/:expoId/addOrder",cors(corsConfig),ExpoController.addOrder);
    server.post("/expo/:expoId/update",cors(corsConfig),ExpoController.updateExpo);
    // const upload = multer({ storage: multer.memoryStorage() });
    // server.post("/expo/:expoId/updateAffiche",upload.single("file"),ExpoController.updateAffiche)
}