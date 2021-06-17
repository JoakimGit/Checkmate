const express = require("express");
const router = express.Router();
const gameDAO = require("../db/gameDAO");

router.get("/mygames", (req, res) => {
    if (req.session.username) {
        res.redirect("/mygames/" + req.session.username);
    }
});

router.get("/mygames/:username", (req, res) => {
    res.sendFile('/views/my-games.html', { root: "./" });
});

router.get("/mygames/fetch/:username", async (req, res) => {
    const games = await gameDAO.getGamesByUsername(req.params.username);
    if (games) {
        res.send(games);
    } else {
        res.send({ });
    }
});

module.exports = {router};