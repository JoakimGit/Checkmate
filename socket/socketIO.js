const io = require("../app");
const sound = require("sound-play");
const gameDB = require("../db/game");
const session = require("../middleware/session");

let playerPool = [];
let playerRooms = [];

module.exports = io.of("/play-online").on("connection", async (socket) => {
  session(socket.handshake, {}, (err) => {
    if (err) {
      console.error(err);
    }
    const username = socket.handshake.session.username;
    if (username) {
      playerPool.push({ socket: socket, username: username });
      const usernames = playerPool.map((user) => {
        return user.username;
      });
      io.of("/play-online").emit("new-player", usernames);
    }
  });

  socket.on("move", (move) => {
    const room = playerRooms.find((roomObj) => roomObj.roomName.includes(socket.id));
    sound.play(__dirname + "/.." + "/public/sfx/wav/Move.wav");
    io.of("/play-online").to(room.roomName).emit("move", move);
  });

  socket.on("startgame", (targetUsername) => {
    srcUsername = socket.handshake.session.username;
    if (srcUsername === targetUsername) return;

    const targetPlayer = playerPool.find((player) => player.username === targetUsername);
    const targetSocket = targetPlayer.socket;
    const roomName = socket.id + targetSocket.id;

    socket.join(roomName);
    targetSocket.join(roomName);

    playerRooms.push({
      roomName: roomName,
      player1: srcUsername,
      player2: targetUsername,
      gameOver: false
    });

    playerPool = playerPool.filter((player) => ![socket, targetSocket].includes(player.socket));

    const oneOrZero = Math.round(Math.random());
    const white = oneOrZero === 0 ? srcUsername : targetUsername;
    const black = oneOrZero === 1 ? srcUsername : targetUsername;

    sound.play(__dirname + "/.." + "/public/sfx/wav/Start.wav");

    io.of("/play-online").to(roomName).emit("begin-game", { white, black });
    io.of("/play-online").emit("player-left", [srcUsername, targetUsername]);
  });

  socket.on("game-over", (gameResult) => {
    sound.play(__dirname + "/.." + "/public/sfx/wav/Mate.wav");
    const room = playerRooms.find((roomObj) => roomObj.roomName.includes(socket.id));
    gameDB.saveGame(gameResult);
    playerRooms = playerRooms.filter((roomObj) => !roomObj.roomName.includes(socket.id));
    io.of("/play-online").to(room.roomName).emit("alert-gameover", gameResult);
  });

  socket.on("disconnect", () => {
    const leavingPlayer = playerPool.find((player) => player.socket === socket);
    if (leavingPlayer) {
      playerPool = playerPool.filter((player) => player.socket !== socket);
      io.of("/play-online").emit("player-left", [leavingPlayer.username]);
    }

    const leavingPlayerRoom = playerRooms.find((roomObj) => roomObj.roomName.includes(socket.id));
    if (leavingPlayerRoom) {
      io.of("/play-online").to(leavingPlayerRoom.roomName).emit("default-win");
    }
  });
});
