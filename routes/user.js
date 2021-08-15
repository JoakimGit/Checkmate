const express = require("express");
const router = express.Router();
const userDB = require("../db/user");

router.get("/users/:username", async (req, res) => {
    try {
        const users = await userDB.getAllUsers();
        const user = users.find(user => user.username === req.params.username);
        if (user) {
            res.send({ username: user.username });   
        }
        else res.send({ }); 
    } catch (error) {
        console.error(error);
    }      
});

router.get("/users", async (req, res) => {
    const users = await userDB.getAllUsers();
    res.send(users);
});

router.get("/user", async (req, res) => {
    try {
        const user = await userDB.getUser("Joakim");
        console.log("Found user:", user);
        res.send({ user });
    } catch (error) {
        console.error(error);
    }
});

module.exports = {router};