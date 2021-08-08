const express = require("express");
const router = express.Router();
const gameDAO = require("../db/gameDAO");

router.get("/games", (req, res) => {
    if (req.session.username) {
        res.redirect("/games/" + req.session.username);
    }
});

router.get("/games/:username", (req, res) => {
    res.sendFile('/views/my-games.html', { root: "./" });
});

router.get("/games/fetch/:username", async (req, res) => {
    const games = await gameDAO.getGamesByUsername(req.params.username);
    console.log(games);
    if (games) {
        res.send(games);
    } else {
        res.send({ });
    }
});

module.exports = {router};