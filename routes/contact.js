const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.get('/contact', (req, res) => {
    res.sendFile('/views/contact.html', { root: "./" });
});

router.post("/contact", (req, res) => {
    const sender = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',        
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: sender.name + ' ' + sender.email,
        to: process.env.EMAIL_NAME,
        subject: sender.subject,
        text: sender.message + '\n' + 'From: ' + sender.email
    };

    transporter.sendMail(mailOptions, err => {
    
        if (err) {
            console.log('Error occured: ' + err);
        } else {
            res.redirect("/contact"); 
        }
    });  
});

module.exports = {router};