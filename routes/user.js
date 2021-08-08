const express = require("express");
const router = express.Router();
const userDAO = require("../db/userDAO");

router.get("/users/:username", async (req, res) => {
    const users = await userDAO.getAllUsers();
    const user = users.find(user => user.username === req.params.username);
    if (user) {
        res.send({ username: user.username });   
    } else res.send({ });   
});

router.get("/users", async (req, res) => {
    const users = await userDAO.getAllUsers();
    res.send(users);
});

module.exports = {router};