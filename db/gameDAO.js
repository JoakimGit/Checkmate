const { MongoClient } = require("mongodb");
require("dotenv").config();

const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.knzcp.mongodb.net/${dbName}?retryWrites=true&w=majority`

let con;

async function connect() {
    if (con) return con;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    con = client.connect();
    return con;
}

async function getGamesByUsername(username) {
    try {
        const client = await connect();  
        const userGames = await client.db(dbName).collection("games")
        .find({ $or: [{"player1" : username}, {"player2" : username}]}).toArray();
        /* console.log("Users:", users);  */
        return userGames;   
    } catch (error) {
          console.error(error);
    }
}

async function saveGame(game) {
    try {
        const client = await connect();  
        const savedGame = await client.db(dbName).collection("games").insertOne(game);
        console.log("New game saved with id:", savedGame.insertedId); 
        return savedGame;
    } catch (error) {
          console.error(error);
    } 
}

module.exports = { saveGame, getGamesByUsername };