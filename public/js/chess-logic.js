let board = Chessboard('chessBoard');
let game = new Chess();
let isComputerGame = null;

const markedSquares = [];

// Chessboard.js config and methods
const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

function onDragStart (source, piece, position, orientation) {
    if (game.game_over()) return false;
    if (isComputerGame) {
      if (orientation === 'white' && piece.search(/^b/) !== -1) return false;
      if (orientation === 'black' && piece.search(/^w/) !== -1) return false;
    }

    if (player === white && piece.search(/^b/) !== -1) return false;
    if (player === black && piece.search(/^w/) !== -1) return false;

    const moves = game.moves({
      square: source,
      verbose: true
    });
    if (moves.length === 0) return;
  
    for (let i = 0; i < moves.length; i++) {
      greenSquare(moves[i].to);
    }
}

function onDrop (source, target) {
    removeGreenSquares();
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });
    if (move === null) return 'snapback';  

    removeHighlights();
    addHighlights(source, target);
    if (window.location.href.includes("/play-online")) {
      checkGameOver();
    }
    if (isComputerGame) window.setTimeout(makeRandomMove, 500);
    if (window.location.href.includes("/play-online")) socket.emit("move", move);
}

function onMoveEnd () {
    $("#chessBoard").find('.square-' + squareToHighlight).addClass('highlight-black');
}
 
function onSnapEnd () {
    board.position(game.fen());
}

// Jquery event handlers
jQuery(function() {
    $("#computerGame").on("click", function() {
      game.reset();
      isComputerGame = true;
      board = Chessboard('chessBoard', config);
    });
    $("#practiceGame").on("click", function() {
      game.reset();
      isComputerGame = false;
      board = Chessboard('chessBoard', config);
    });
  
    $("#flip").on("click", async function() {
      board.flip();
      console.log("Orientation:", board.orientation());
      if (isComputerGame && board.orientation() === 'black') {
        makeRandomMove();
      }
    });
  
    $("#reset").on("click", function() {
      game.reset();
      board = Chessboard('chessBoard', config);
    })
  
    $("#chessBoard").on("contextmenu", ".square-55d63", rightclickSquare);
  
    $("#chessBoard").on("click", removeMarkedSquares);  
});

// Functions related to highlighting squares
function rightclickSquare() {
    const square = $(this).data("square");
    $("#chessBoard .square-" + square).addClass("markedSquare")
    markedSquares.push(square);
    return false;
}

function removeMarkedSquares() {
    if (markedSquares.length === 0) return

    markedSquares.forEach(square => {
        $("#chessBoard .square-" + square).removeClass("markedSquare");
    });
}

function greenSquare (square) {
    const $square = $('#chessBoard .square-' + square);

    let background = '#83e67a';
    if ($square.hasClass('black-3c85d')) {
        background = '#45b83d';
    }

    $square.css('background', background);
}

function removeGreenSquares () {
    $('#chessBoard .square-55d63').css('background', '');
}

function addHighlights (source, target) {
    if (game.turn() === 'b') {
      $("#chessBoard").find('.square-' + source).addClass('highlight-white');
      $("#chessBoard").find('.square-' + target).addClass('highlight-white');
    } else {
      $("#chessBoard").find('.square-' + source).addClass('highlight-black');
      $("#chessBoard").find('.square-' + target).addClass('highlight-black');
    }
}

function removeHighlights () {
    $("#chessBoard").find('.square-55d63').removeClass('highlight-white highlight-black');
}

// Computer moves
function makeRandomMove () {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;
  
    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
}