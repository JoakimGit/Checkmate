const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userDAO = require("../db/userDAO");

router.get("/register", (req, res) => {
    res.sendFile("/views/register.html", { root: "./" });
});

router.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.redirect("/register");
    }
    try {
        const users = await userDAO.getAllUsers();
        if (users.find(user => user.username === username)) {
            return res.redirect("/register");
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        user = {
            username,
            email,
            password: hashedPassword
        };

        const newUser = await userDAO.createUser(user);
        res.redirect("/login");

    } catch (error) {
        console.error(error);
    }
});

module.exports = {router};