let hasPlayerPool = false;

const socket = io.connect("/play-online");

socket.on("move", (move) => {
    game.move(move);
    board.position(game.fen());
});

socket.on("new-player", (playerPool) => {
    if (!hasPlayerPool) {
        playerPool.map(player => createNewPlayer(player));
    } else {
        createNewPlayer(playerPool[playerPool.length -1]);
    } 
    hasPlayerPool = true;
});

socket.on("player-left", (username) => {
    document.getElementById(username).remove();
});

socket.on("begin-game", () => {
    $("#playerPool").hide();
    board = Chessboard('chessBoard', config);
});

function checkGameOver() {

    if (game.in_checkmate()) {
        console.log("There was a checkmate");
        const gameResult = {
            result: "Checkmate",
            loser: game.turn(),
            history: game.history(),
            fen: game.fen()
        }
        socket.emit("game-over", gameResult);
    }
    else if (game.in_stalemate()) {
        console.log("Game ended in a draw by stalemate");
        const gameResult = {
            result: "Stalemate",
            loser: 'draw',
            history: game.history(),
            fen: game.fen()
        }
        socket.emit("game-over", gameResult);
    }
    else if (game.in_threefold_repetition()) {
        console.log("Game ended by repetition");
        const gameResult = {
            result: "Repetition",
            loser: 'draw',
            history: game.history(),
            fen: game.fen()
        }
        socket.emit("game-over", gameResult);
    }
    else if (game.insufficient_material()) {
        console.log("Game ended by insufficient material");
        const gameResult = {
            result: "Insufficient material",
            loser: 'draw',
            history: game.history(),
            fen: game.fen()
        }
        socket.emit("game-over", gameResult);
    }
}

function createNewPlayer(player) {
    const playerPoolDiv = document.getElementById('playerPool');
    const playerDiv = document.createElement("div");
    const playerBtn = document.createElement("button");

    playerDiv.id = player;
    playerBtn.classList = 'playerBtn';
    playerBtn.textContent = player;
    playerBtn.onclick = function() {
        const targetUser = this.textContent;
        socket.emit("startgame", targetUser);
    }

    playerDiv.appendChild(playerBtn);
    playerPoolDiv.appendChild(playerDiv);
}