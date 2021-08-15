let board = Chessboard('chessBoard');
let game = new Chess();
let isComputerGame = null;
let player;

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

    if (player) {
      if (player === white && piece.search(/^b/) !== -1) return false;
      if (player === black && piece.search(/^w/) !== -1) return false;
    }

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
    if (isComputerGame) window.setTimeout(makeRandomMove, 500);
    if (window.location.href.includes("/play-online")) socket.emit("move", move);
}

function onSnapEnd () {
    board.position(game.fen());
    if (window.location.href.includes("/play-online")) {
      checkGameOver();
    }
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
    });
  
    $("#chessBoard").on("contextmenu", ".square-55d63", rightclickSquare);
  
    $("#chessBoard").on("click", removeMarkedSquares);
});

// Functions related to highlighting squares
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

// Computer moves
function makeRandomMove () {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;
  
    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
}