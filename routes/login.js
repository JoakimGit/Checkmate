const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userDB = require("../db/user");

router.get("/login", (req, res) => {
  res.sendFile("/views/login.html", { root: "./" });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userDB.getUser(username);
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.username = user.username;
        return res.redirect("/");
      } else {
        return res.redirect("/login");
      }
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login/guest", (req, res) => {
  let guestName = "Guest";
  for (let i = 0; i < 6; i++) {
    const num = Math.floor(Math.random() * 10);
    guestName += num;
  }
  req.session.username = guestName;
  return res.json({ name: guestName });
});

router.get("/login/logged-in-user", (req, res) => {
  res.send({ username: req.session.username });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  return res.redirect("/");
});

module.exports = { router };
