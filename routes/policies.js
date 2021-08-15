const express = require("express");
const router = express.Router();

router.get("/privacy-and-cookie-policy", (req, res) => {
    res.sendFile('/views/policies.html', { root: "./" });
});

module.exports = {router};