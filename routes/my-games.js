const express = require("express");
const router = express.Router();
const gameDB = require("../db/game");

router.get("/games/overview/:username", (req, res) => {
  res.sendFile("/views/my-games.html", { root: "./" });
});

router.get("/games/:id", (req, res) => {
  res.sendFile("/views/game-details.html", { root: "./" });
});

router.get("/games/all/:username", async (req, res) => {
  const games = await gameDB.getGamesByUsername(req.params.username);
  res.send({ games });
});

router.get("/games/single/:id", async (req, res) => {
  const game = await gameDB.getGameById(req.params.id);
  res.send({ game });
});

module.exports = { router };
