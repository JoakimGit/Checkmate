const game = new Chess();
let board;
let openingMoves;
let currentMove = 0;

const markedSquares = [];

const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

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

// Opening related functions

function startOpening(openingName) {
    $(".opening-col").hide();
    initBoard();
    openingMoves = openings[openingName];
    moveThroughOpening(openingMoves);
}

function initBoard() {
    board = Chessboard('chessBoard', config);
    $("#chessBoard").show();
    $(".game-buttons").show();
}

function moveThroughOpening(opening) {
    for (let i = 1; i < opening.length+1; i++) {
        setTimeout(() => {
            game.move(opening[i-1]);
            board.position(game.fen());
            currentMove++;
        }, i * 1000);
    }
    return false;
}

// Chess related functions

function onDragStart (source, piece, position, orientation) {
    if (game.game_over()) return false;

    const moves = game.moves({
      square: source,
      verbose: true
    });
    if (moves.length === 0) return;
    showLegalMoves(moves);
}

function onDrop (source, target) {
    hideLegalMoves();
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });
    if (move === null) return 'snapback';
}

function onSnapEnd () {
    board.position(game.fen());
    currentMove++;
}

// Event handlers

jQuery(function() {  
    $("#prev").on("click", function() {
        game.undo();
        currentMove--;
        board.position(game.fen());
    });

    $("#next").on("click", function() {
      if (currentMove >= openingMoves.length) return;
      game.move(openingMoves[currentMove]);
      currentMove++;
      board.position(game.fen());
    });
  
    $("#flip").on("click", function() {
      board.flip(); 
    });
  
    $("#chessBoard").on("contextmenu", ".square-55d63", rightclickSquare);
  
    $("#chessBoard").on("click", removeMarkedSquares);
});

// Highlighting related functions

function rightclickSquare() {
    const square = $(this).data("square");
    $("#chessBoard .square-" + square).addClass("markedSquare");
    markedSquares.push(square);
    return false;
}
  
function removeMarkedSquares() {
    if (markedSquares.length === 0) return;
    markedSquares.forEach(square => {
        $("#chessBoard .square-" + square).removeClass("markedSquare");
    });
}

function showLegalMoves(moves) {
    for (let i = 0; i < moves.length; i++) {
        const square = $('#chessBoard .square-' + moves[i].to);
        if (square.hasClass("black-3c85d")) {
            square.css("background-color", "#8888f4");
        }
        else {
            square.css("background-color", "#a2c4f9");
        }
    }
}

function hideLegalMoves() {
    $("#chessBoard .square-55d63").css("background-color", "");
}

function highlightPrevMove(source, target) {
    $('#chessBoard .square-' + source).addClass("highlight-white");
    $('#chessBoard .square-' + target).addClass("highlight-white");  
}

function removeHighlight() {
    $('#chessBoard .square-55d63').removeClass("highlight-white highlight-black");
}