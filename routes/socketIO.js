const io = require("../app");
const sound = require("sound-play");
const gameDAO = require("../db/gameDAO");
const session = require("../middleware/session");

let playerPool = [];
let playerRooms = [];


module.exports = io.of('/play-online').on('connection', async (socket) => {
    session(socket.handshake, {}, (err) => {        
        if (err) { /* handle error */ }
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
});