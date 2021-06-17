const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = module.exports = require("socket.io")(server);
const session = require("./middleware/session");
const authenticate = require("./middleware/authenticate");
/* const sound = require("sound-play");
const gameDAO = require("./db/gameDAO"); */

const loginRouter = require("./routes/login");
const playRouter = require("./routes/play");
const registerRouter = require("./routes/register");
const userRouter = require("./routes/user");
const openingsRouter = require("./routes/openings");
const rulesRouter = require("./routes/rules");
const myGamesRouter = require("./routes/myGames");
const socketIO = require("./routes/socketIO");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));
app.use("/gameboard", express.static(__dirname + "/node_modules/@chrisoakman/chessboardjs/dist"));
app.use("/gamelogic", express.static(__dirname + "/node_modules/chess.js"));
app.set("trust proxy", 1);

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

/* io.use((socket, next) => {
    const handshakeData = socket.request
    session(handshakeData, {}, (err) =>  {
      if (err) return accept(err)
      const session = socket.handshake.session;
      accept(null, session.username != null)
    });
}); */

/* io.use((socket, next) => {
    const handshakeData = socket.request
    session(handshakeData, {}, (err) =>  {        
        if (!socket.handshake.session.username) {
            next(new Error("not authorized"));
        } else {
            next();
        }
    });
}); */

/* let playerPool = [];
let playerRooms = [];


io.of('/play-online').on('connection', async (socket) => {
    session(socket.handshake, {}, (err) => {        
        if (err) {  }
        const username = socket.handshake.session.username;
        if (username) {
            playerPool.push({ socket: socket, username: username });
            const usernames = playerPool.map((user) => { return user.username });
            io.of('/play-online').emit("new-player", usernames);            
        }        
    });
    console.log("New connection on:", socket.id); 
    
    socket.on('move', (move) => {
        const room = playerRooms.find(roomObj => roomObj.roomName.includes(socket.id));
        sound.play(__dirname + "/public/sfx/wav/Move.wav");
        io.of("/play-online").to(room.roomName).emit("move", move);
    });

    socket.on("startgame", (targetUser) => {
        const targetPlayer = playerPool.find((player) => player.username === targetUser);
        const targetSocket = targetPlayer.socket;
        const roomName = socket.id + targetSocket.id;

        socket.join(roomName);
        targetSocket.join(roomName);


        playerRooms.push({
            roomName: roomName,
            player1: socket.handshake.session.username,
            player2: targetPlayer.username 
        });

        console.log(socket.rooms);
        console.log(targetSocket.rooms);
        io.of("/play-online").to(roomName).emit("begin-game");
    });

    socket.on("game-over", (gameResult) => {
        const room = playerRooms.find(roomObj => roomObj.roomName.includes(socket.id));
        const game = {...gameResult, player1: room.player1, player2: room.player2};
        gameDAO.saveGame(game);
    
    });

    socket.on("disconnect", () => {        
        const leavingPlayer = playerPool.find((player) => player.socket === socket);
        playerPool = playerPool.filter((player) => { return player.socket !== socket });
        playerRooms = playerRooms.filter((roomObj) => { return !roomObj.roomName.includes(socket.id) });
        if (leavingPlayer) {
            io.of('/play-online').emit("player-left", leavingPlayer.username);
        }        
    });
}); */

server.listen(8080, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Listening to server at port", 8080);
});