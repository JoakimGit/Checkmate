let board;
let game = new Chess();

function startOpening(openingName) {
    $(".opening-col").hide();
    initBoard();
    const opening = openings[openingName]
    moveThroughOpening(opening);
}

function initBoard() {
    board = Chessboard('chessBoard', 'start');
    $("#chessBoard").show();
}

function moveThroughOpening(opening) {
    for (let i = 1; i < opening.length+1; i++) {
        setTimeout(() => {
            game.move(opening[i-1])    
            board.position(game.fen());
        }, i * 1000);
    }
}

const openings = {
    stafford : ['e4', 'e5', 'Nf3', 'Nf6', 'Nxe5', 'Nc6', 'Nxc6', 'dxc6'],
    queenGambit : ['d4', 'd5', 'c4'],
    scandi : ['e4', 'd5'],
    caro : ['e4', 'c6'],
    kingsIndian : ['d4', 'Nf6', 'c4', 'g6'],
    scotch : ['e4', 'e5', 'Nf3', 'Nc6', 'd4'],
    italian : ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    spanish : ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    sicillian : ['e4', 'c5']
}