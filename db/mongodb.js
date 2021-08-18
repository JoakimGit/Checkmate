const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const dbName = process.env.DB_NAME;
const dbUri = process.env.DB_URI

let db;

module.exports = {
  connectToServer: (callback) => {
    MongoClient.connect(dbUri,  { useUnifiedTopology: true , useNewUrlParser: true }, (err, client) => {
      db = client.db(dbName);
      return callback(err);
    });
  },

  getDb: () => {
    return db;
  }
};