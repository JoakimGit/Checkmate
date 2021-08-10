const express = require("express");
const router = express.Router();
const gameDAO = require("../db/gameDAO");

router.get("/games", (req, res) => {
    if (req.session.username) {
        res.redirect("/games/overview/" + req.session.username);
    }
});

router.get("/games/overview/:username", (req, res) => {
    res.sendFile('/views/my-games.html', { root: "./" });
});

router.get("/games/:id", (req, res) => {
    res.send({ game: "This is where you will see your game with id: " + req.params.id })
})

router.get("/games/all/:username", async (req, res) => {
    const games = await gameDAO.getGamesByUsername(req.params.username);
    if (games) {
        res.send(games);
    } else {
        res.send({ });
    }
});

module.exports = {router};