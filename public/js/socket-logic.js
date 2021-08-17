let hasPlayerPool = false;
let white;
let black;

const socket = io.connect("/play-online");

socket.on("move", (move) => {
    removeHighlight();
    highlightPrevMove(move.from, move.to);
    game.move(move);
    board.position(game.fen());
});

socket.on("new-player", (playerPool) => {
    if (!hasPlayerPool) {
        playerPool.forEach(player => createNewPlayer(player));
    } else {
        createNewPlayer(playerPool[playerPool.length -1]);
    }
    hasPlayerPool = true;
});

socket.on("player-left", (usernames) => {
    usernames.forEach(name => {
        document.getElementById(name).remove();
    });
});

socket.on("begin-game", (players) => {
    white = players.white;
    black = players.black;
    console.log("White is:", white);
    console.log("Black is:", black);
    $("#playerPool").hide();
    board = Chessboard('chessBoard', config);
    setOrientation();
});

socket.on("alert-gameover", (gameResult) => {
    let alertText;
    if (gameResult.winner !== "Neither") {
        alertText = `Game is over! ${gameResult.winner} won by: ${gameResult.result}.`
    } else {
        alertText = `Game is over! Neither player won due to: ${gameResult.result}.`
    }
    setTimeout(() => {
        alert(alertText);        
    }, 500);
});

socket.on("default-win", () => {
    const gameResult = {
        white: white,
        black: black,
        result: "Forfeit",
        winner: player === white ? 'White' : 'Black',
        history: game.history(),
        date: new Date()
    }
    socket.emit("game-over", gameResult);
});

function checkGameOver() {
    if (game.game_over()) {
        const gameResult = {
            white: white,
            black: black,
            result: "",
            winner: "Neither",
            history: game.history(),
            date: new Date()
        }
        if (game.in_checkmate()) {
            gameResult.result = "Checkmate";
            gameResult.winner = game.turn() === 'w' ? "Black" : "White"
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

function setOrientation() {
    if (player === black) {
        board.orientation('black');
    }
}