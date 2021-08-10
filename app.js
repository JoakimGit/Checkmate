const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = module.exports = require("socket.io")(server);
const session = require("./middleware/session");
const authenticate = require("./middleware/authenticate");

const loginRouter = require("./routes/login");
const playRouter = require("./routes/play");
const registerRouter = require("./routes/register");
const userRouter = require("./routes/user");
const openingsRouter = require("./routes/openings");
const rulesRouter = require("./routes/rules");
const myGamesRouter = require("./routes/my-games");
const socketIO = require("./routes/socketIO");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));
app.use("/gameboard", express.static(__dirname + "/node_modules/@chrisoakman/chessboardjs/dist"));
app.use("/gamelogic", express.static(__dirname + "/node_modules/chess.js"));
/* app.set("trust proxy", 1); */

app.use(session);
app.use(loginRouter.router);
app.use(registerRouter.router);
app.use(userRouter.router);
app.use(openingsRouter.router);
app.use(rulesRouter.router);
app.use(playRouter.router);
app.use(authenticate);
app.use(myGamesRouter.router);

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html');;
});

server.listen(8080, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Listening to server at port", 8080);
});