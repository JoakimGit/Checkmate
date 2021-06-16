const express = require("express");
const router = express.Router();
const userDAO = require("../db/userDAO");

router.get('/users', (req, res) => {
    res.json(userDAO.findUsers());
});

router.get("/users/:username", (req, res) => {
    const user = userDAO.findUsers().find(user => user.username === req.params.username);
    if (user) {
        res.send({ username: user.username });   
    } else res.send({ });   
});

module.exports = {router};