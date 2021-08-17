const express = require("express");
const router = express.Router();

router.get(["", "/"], (req, res) => {
    res.sendFile('/views/home.html', { root: "./" });
});

module.exports = {router};