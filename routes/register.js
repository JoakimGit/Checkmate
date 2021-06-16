const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userDAO = require("../db/userDAO");

router.get("/register", (req, res) => {
    res.sendFile("/views/register.html", { root: "./" });
});

router.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    // Check if password match

    // Check if user already exists
    if (userDAO.findUsers().find(user => user.username === username)) {
        res.redirect("/register");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    // Persist user
    user = {
        username,
        email,
        password: hashedPassword
    };
    userDAO.createUser(user);
    res.redirect("/login");
});

module.exports = {router};