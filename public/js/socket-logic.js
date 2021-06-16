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