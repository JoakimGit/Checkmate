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
        // Does user exist and password match?
        const user = userDAO.findUsers().find(user => user.username === username);
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.username = user.username
            res.redirect("/");
        } else {
            res.sendFile("/views/login-failed.html", { root: "./" });
        }
    } catch (error) {
        console.log(error);
    }    
});

module.exports = {router};