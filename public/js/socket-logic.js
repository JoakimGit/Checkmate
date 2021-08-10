let hasPlayerPool = false;
let white;
let black;

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

socket.on("begin-game", (players) => {
    white = players.white;
    black = players.black;
    console.log("White is:", white);
    console.log("Black is:", black);
    $("#playerPool").hide();
    board = Chessboard('chessBoard', config);
});

function checkGameOver() {
    if (game.game_over()) {
        const gameResult = {
            white: white,
            black: black,
            result: "",
            history: game.history(),
            fen: game.fen(),
            date: new Date()
        }
        if (game.in_checkmate()) {
            gameResult.result = "Checkmate";
            gameResult.winner = game.turn() === 'w' ? "White" : "Black"
        }
        else if (game.in_stalemate()) {
            gameResult.result = "Draw by stalemate";
        }
        else if (game.in_threefold_repetition()) {
            gameResult.result = "Draw by repetition";
        }
        else if (game.insufficient_material()) {
            gameResult.result = "Draw by insufficient material";
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