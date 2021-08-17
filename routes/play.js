const express = require("express");
const router = express.Router();

router.get('/play', (req, res) => {
    res.sendFile('/views/play.html', { root: "./" });
});

router.get('/play-online', (req, res) => {
    res.sendFile('/views/play-online.html', { root: "./" });
});

module.exports = {router};