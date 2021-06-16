let users = [
    {
        username: 'Joakim',
        email: 'jokke34@gmail.com',
        password: '$2b$10$o9d9gO.R3.jyBl8pPZ/HweHw/lO3TxEasPtyy9yKbGPwmOZ6krkwC'
    },
    {
        username: "Bob",
        email: "Fisken@yahoo.com",
        password: "$2b$10$l7qYKtF7lzSzLSShylqWz.7o1UAfNDF9CTprho04qeCXVDYU8cOgC"
    },
    {
        username: "Danya",
        email: "naroditsky@hotmail.com",
        password: "$2b$10$.vlpsjNqlaFP0nqludKlLup3TQAqnnXH8NY2CEP9PnN7c4bgCOsXW"
    }
];

function findUsers() {
    return users;
}

function createUser(user) {
    users.push(user);
}

module.exports = { findUsers, createUser };