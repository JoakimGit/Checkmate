const express = require("express");
const router = express.Router();
const userDB = require("../db/user");

router.get("/users/:username", async (req, res) => {
    try {
        const user = await userDB.getUser();
        if (user) {
            res.send({ username: user.username });   
        }
        else res.send({ }); 
    } catch (error) {
        console.error(error);
    }      
});

module.exports = {router};