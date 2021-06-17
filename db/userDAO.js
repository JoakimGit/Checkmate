const { MongoClient } = require("mongodb");
require("dotenv").config();

const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.knzcp.mongodb.net/${dbName}?retryWrites=true&w=majority`
 */
let con;

async function connect() {
    if (con) return con;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    con = client.connect();
    return con;
}

async function getAllUsers() {
    try {
        const client = await connect();  
        const users = await client.db(dbName).collection("users").find().toArray();
        return users;   
    } catch (error) {
          console.error(error);
    }
}

async function createUser(newUser) {
    try {
        const client = await connect();  
        const createdUser = await client.db(dbName).collection("users").insertOne(newUser);
        console.log("New user created with id:", createdUser.insertedId); 
        return createdUser;
    } catch (error) {
          console.error(error);
    } 
}

module.exports = { createUser, getAllUsers };