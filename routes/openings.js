const express = require("express");
const router = express.Router();

router.get('/openings', (req, res) => {
    res.sendFile('/views/openings.html', { root: "./" });
});

module.exports = {router};