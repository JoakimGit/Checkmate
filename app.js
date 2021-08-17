const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = module.exports = require("socket.io")(server);
const session = require("./middleware/session");
const mongodb = require("./db/mongodb");
const authenticate = require("./middleware/authenticate");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));
app.use("/gameboard", express.static(__dirname + "/node_modules/@chrisoakman/chessboardjs/dist"));
app.use("/gamelogic", express.static(__dirname + "/node_modules/chess.js"));

mongodb.connectToServer(function(err) {
    if (err) console.log(err);

    const userdb = require("./db/user");
    const gamedb = require("./db/game");
    
    const indexRouter = require("./routes/index");
    const cookiePolicyRouter = require("./routes/policies");
    const loginRouter = require("./routes/login");
    const registerRouter = require("./routes/register");
    const userRouter = require("./routes/user");
    const rulesRouter = require("./routes/rules");
    const contactRouter = require("./routes/contact");
    const openingsRouter = require("./routes/openings");
    const playRouter = require("./routes/play");
    const myGamesRouter = require("./routes/my-games");
    const pageNotFoundRouter = require("./routes/not-found");
    const socketIO = require("./socket/socketIO");
    
    app.use(session);
    app.use(registerRouter.router);
    app.use(loginRouter.router);
    app.use(authenticate);
    app.use(indexRouter.router);
    app.use(cookiePolicyRouter.router);
    app.use(userRouter.router);
    app.use(rulesRouter.router);
    app.use(contactRouter.router);
    app.use(openingsRouter.router);
    app.use(playRouter.router);
    app.use(myGamesRouter.router);
    app.use(pageNotFoundRouter.router);

    const PORT = process.env.PORT || 8080;

    server.listen(PORT, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("Listening to server at port", PORT);
    });
});