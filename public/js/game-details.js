const game = new Chess();
let currentGame;
let gameMoves;
let currentMove = 0;

const markedSquares = [];

// Chessboard.js config and methods
const config = {
    draggable: true,
    position: 'start',
    pieceTheme: '../img/chesspieces/wikipedia/{piece}.png',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

let board = Chessboard('chessBoard', config);;

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

// Jquery event handlers
jQuery(function() {
    const url = window.location.href;
    const gameID = url.substring(url.lastIndexOf("/") + 1);
    getGameById(gameID).then(data => {
        currentGame = data;
        gameMoves = data.history;
        createGameDetailsDiv(data);
    });
  
    $("#prev").on("click", function() {
        game.undo();
        currentMove--;
        board.position(game.fen());
    });

    $("#next").on("click", function() {
      if (currentMove >= gameMoves.length) return;
      game.move(gameMoves[currentMove]);
      currentMove++;
      board.position(game.fen());
    });
  
    $("#flip").on("click", function() {
      board.flip(); 
    });
  
    $("#chessBoard").on("contextmenu", ".square-55d63", rightclickSquare);
  
    $("#chessBoard").on("click", removeMarkedSquares);
});

function createGameDetailsDiv(game) {
    const detailsDiv = document.getElementById("game-details");
    
    const whiteP = document.createElement("p");
    const blackP = document.createElement("p");
    const resultP = document.createElement("p");
    const winnerP = document.createElement("p");
    const dateP = document.createElement("p");

    const date = new Date(game.date);
    const day = date.getDate().toString().length === 1 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();

    whiteP.innerText = `White: ${game.white}`;
    blackP.innerText = `Black: ${game.black}`;
    resultP.innerText = `Result: ${game.result}`;
    winnerP.innerText = `Winner: ${game.winner}`;;
    dateP.innerText = `Date: ${day}/${month}-${year}`

    detailsDiv.appendChild(whiteP);
    detailsDiv.appendChild(blackP);
    detailsDiv.appendChild(resultP);
    detailsDiv.appendChild(winnerP);
    detailsDiv.appendChild(dateP);   
}

async function getGameById(id) {
    const response = await fetch(`/games/single/${id}`);
    const game = await response.json();
    return game.game;
}

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