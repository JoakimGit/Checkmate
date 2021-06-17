const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
require("dotenv").config();

const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const secret = process.env.SESSION_SECRET;

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.knzcp.mongodb.net/${dbName}?retryWrites=true&w=majority`

const store = new MongoDBStore({
    uri: uri,
    collection: 'mySessions',
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
});

store.on('error', function(error) {
    console.log(error);
});

module.exports = session({
    store: store,
    secret: secret,
    saveUninitialized: false,
    resave: false,
    name: "sessionID",
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
});