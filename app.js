const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require("socket.io")(server)

app.use(express.static('public'));
app.use("/gameboard", express.static(__dirname + "/node_modules/@chrisoakman/chessboardjs/dist"))
app.use("/gamelogic", express.static(__dirname + "/node_modules/chess.js"))

io.on('connection', (socket) => {
    console.log("New connection");

    socket.on('move', (move) => {
        console.log("Received move from client:", move);
        socket.broadcast.emit("move", move)
    });
})

app.get('/play', (req, res) => {
    res.sendFile(__dirname + '/public/game.html');
});

server.listen(8080, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Listening to server at port", 8080);
});