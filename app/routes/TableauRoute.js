const multer = require("multer")
module.exports = (server,corsConfig) => {
    const TableauController = require("../controllers/TableauxController");
    const cors = require('cors');

    server.post("/tableau/getAll", cors(corsConfig), TableauController.getAllTableaux);
    server.get("/tableau/getById/:tableauid", cors(corsConfig),TableauController.getTableauById);
    server.post("/tableau/getByExpo",cors(corsConfig),TableauController.getTableauxByExpo)
    server.post("/tableau/create",cors(corsConfig),TableauController.createTableau);

    const upload = multer({ storage: multer.memoryStorage() });
    server.post("/tableau/addImage/",upload.single("file"),TableauController.addImage)
    server.post("/tableau/addMultipleImage/",upload.array("files",10),TableauController.addMultipleImage)
    server.get("/tableau/getImage/:tableauid",cors(corsConfig),TableauController.getImage)
    
    server.post("/tableau/addExpo/:tableauid",cors(corsConfig),TableauController.addExpo)
    server.post("/tableau/counts",cors(corsConfig),TableauController.counts)
}