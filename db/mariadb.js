// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Youtube',
    dateStrings: true,
});


connection.connect(error => {
    if (error) {
        console.error('Database connection failed: ' + error.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = connection;