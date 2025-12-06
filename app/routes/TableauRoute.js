// const multer = require("multer")
module.exports = (server,corsConfig) => {
    const TableauController = require("../controllers/TableauxController");
    const cors = require('cors');

    server.post("/tableau/getAll", cors(corsConfig), TableauController.getAllTableaux);
    server.get("/tableau/getById/:tableauId", cors(corsConfig),TableauController.getTableauById);
    server.post("/tableau/getByExpo",cors(corsConfig),TableauController.getTableauxByExpo)
    // server.post("/tableau/create",upload.single("file"),cors(corsConfig),TableauController.createTableau);

    // const upload = multer({ storage: multer.memoryStorage() });
    // server.post("/tableau/addMultipleImage/",upload.array("files",10),cors(corsConfig),TableauController.addMultipleImage)
    server.get("/tableau/:tableauId/getImage",cors(corsConfig),TableauController.getImage)
    
    server.post("/tableau/:tableauId/addExpo",cors(corsConfig),TableauController.addExpo)
    server.post("/tableau/counts",cors(corsConfig),TableauController.counts)
   
    server.post("/tableau/:tableauId/update",cors(corsConfig),TableauController.updateTableau)
    server.post("/tableau/:tableauId/rotate",cors(corsConfig),TableauController.rotateTableau)
    // server.post("/tableau/:tableauId/updateTableau",upload.single("file"),cors(corsConfig),TableauController.updateTableauImage)
   
}