async function getGamesByName(username) {
    let response = await fetch(`/mygames/fetch/${username}`);
    let games = await response.json();
    return games;
}

jQuery(async function() {
    const url = window.location.href;
    const username = url.substring(url.lastIndexOf("/") + 1);
    const games = await getGamesByName(username);
    createGamesTable(games);
});

function createGamesTable(games) {
    const table = document.getElementById("gamesTable");

    games.forEach(game => {
        const tableRow = document.createElement("tr");
        const player1TD = document.createElement("td");
        const player2TD = document.createElement("td");
        const resultTD = document.createElement("td");
        const winnerTD = document.createElement("td");

        player1TD.innerText = game.player1;
        player2TD.innerText = game.player2;
        resultTD.innerText = game.result;
        game.loser === 'b' ? winnerTD.innerText = 'White' : winnerTD.innerText = 'Black';

        tableRow.appendChild(player1TD);
        tableRow.appendChild(player2TD);
        tableRow.appendChild(resultTD);
        tableRow.appendChild(winnerTD);
        table.appendChild(tableRow);
    });
}