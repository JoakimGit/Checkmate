jQuery(async function () {
  const url = window.location.href;
  const username = url.substring(url.lastIndexOf("/") + 1);
  const games = await getGamesByName(username);
  createGamesTable(games);
});

async function getGamesByName(username) {
  let response = await fetch(`/games/all/${username}`);
  let games = await response.json();
  return games.games;
}

function createGamesTable(games) {
  const table = document.getElementById("gamesTable");

  games.forEach((game) => {
    const tableRow = document.createElement("tr");
    const player1TD = document.createElement("td");
    const player2TD = document.createElement("td");
    const resultTD = document.createElement("td");
    const winnerTD = document.createElement("td");
    const dateTD = document.createElement("td");
    const linkTD = document.createElement("td");

    const date = new Date(game.date);
    const day = date.getDate().toString().length === 1 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    player1TD.innerText = game.white;
    player2TD.innerText = game.black;
    resultTD.innerText = game.result;
    winnerTD.innerText = game.winner;
    dateTD.innerText = `${day}/${month}-${year}`;
    linkTD.innerHTML = `<a href="/games/${game._id}">See game</a>`;

    tableRow.appendChild(player1TD);
    tableRow.appendChild(player2TD);
    tableRow.appendChild(resultTD);
    tableRow.appendChild(winnerTD);
    tableRow.appendChild(dateTD);
    tableRow.appendChild(linkTD);
    table.appendChild(tableRow);
  });
}
