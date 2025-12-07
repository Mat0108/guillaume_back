const Message = require("../models/mailModel")

const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
  host: "ssl0.ovh.net",        // Exemple OVH
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_NAME,
    pass: process.env.MAIL_PASSWORD
  }
});

exports.sendMail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }
    transporter.sendMail({
    from: process.env.MAIL_NAME,
    to: email,
    subject: "Nouveau message depuis le site",
    html: `
      <p><strong>Nom:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `
  },(error, info) => {
              if (error){
                  res.json({message: "Impossible d'envoyer le mail"});
                  res.status(400);
              }else{
                  res.status(200).json({"message": "Votre mail a bien été envoyé"})
              };});
}

exports.getMessages = async (req,res)=>{
  Message.find().exec((error,messages)=>{
     if (error){
        res.json({message: "Impossible de récupérer les messages"});
        res.status(400);
    }else{
        res.status(200).json(messages)
    };
  })
}
exports.createMessage = async (req,res)=>{
  let newMassage = new Message({...req.body,date:new Date()})

  newMassage.save((error,message)=>{
     if (error){
        res.json({message: "Impossible de créer un message"});
        res.status(400);
    }else{
        res.status(200).json(message)
    };
  })
}