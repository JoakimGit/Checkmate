const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
require("dotenv").config();

const dbUri = process.env.DB_URI;
const secret = process.env.SESSION_SECRET;

const store = new MongoDBStore({
    uri: dbUri,
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