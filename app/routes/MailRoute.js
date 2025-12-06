const Mail = require("nodemailer/lib/mailer");

module.exports = (server,corsConfig) => {
    const MailController = require("../controllers/MailController");
    const cors = require('cors');

    server.post("/contact/send",cors(corsConfig),MailController.sendMail);
    server.get("/messages/",cors(corsConfig),MailController.getMessages);
    server.post("/messages/create",cors(corsConfig),MailController.createMessage)
}