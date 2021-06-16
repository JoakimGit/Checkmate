const session = require("express-session");

module.exports = session({
    secret: "mySecret",
    saveUninitialized: false,
    resave: false,
    name: "sessionID",
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 10
    }
});