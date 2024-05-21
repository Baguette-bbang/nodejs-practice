const maria = require('mysql2');

const connection = maria.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Book-shop',
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