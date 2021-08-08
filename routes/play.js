const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

router.get('/play', (req, res) => {
    res.sendFile('/views/play.html', { root: "./" });
});

router.get('/play-online', authenticate, (req, res) => {
    res.sendFile('/views/play-online.html', { root: "./" });
});

module.exports = {router};