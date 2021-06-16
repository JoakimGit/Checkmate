const express = require("express");
const router = express.Router();

router.get('/rules', (req, res) => {
    res.sendFile('/views/rules.html', { root: "./" });
});

module.exports = {router};