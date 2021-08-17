const mongodb = require('./mongodb');
const db = mongodb.getDb();

function getAllUsers() {
    try {
        const users = db.collection("users").find().toArray();
        return users;   
    } catch (error) {
        console.error(error);
    }
}

function createUser(newUser) {
    try {
        const createdUser = db.collection("users").insertOne(newUser);
        return createdUser;
    } catch (error) {
        console.error(error);
    } 
}

function getUser(username) {
    try {
        const user = db.collection("users").findOne({ username });
        return user;
    } catch (error) {
        console.error(error);
    } 
}

module.exports = { createUser, getAllUsers, getUser };