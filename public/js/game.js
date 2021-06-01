let board;
let game;

window.onload = function() {
    initGame();
}

const socket = io();

const initGame = function() {
    const config = {
        draggable: true,
        position: 'start',
        onDrop: onDrop
    };

    board = new Chessboard('chessBoard', config)
    game = new Chess();
};

const onDrop = function(source, target) {
    let move = game.move({from: source, to: target});
    if (move === null) return 'snapback';
    else socket.emit("move", move);
}

socket.on("move", (move) => {
    game.move(move);
    board.position(game.fen());
});