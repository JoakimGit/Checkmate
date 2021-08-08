const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userDAO = require("../db/userDAO");

router.get("/login", (req, res) => {
    res.sendFile("/views/login.html", { root: "./" });
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await userDAO.getAllUsers();
        const user = users.find(user => user.username === username);
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.username = user.username;
                res.redirect("/");
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
        
    } catch (error) {
        console.log(error);
    }    
});

router.get("/login/logged-in-user", (req, res) => {    
    res.send({ username: req.session.username });
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

module.exports = {router};