const maria = require('mysql2/promise');

const connection = async () => {
    const conn = await maria.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Book-shop',
        dateStrings: true,
    });
    return conn
};

const testConnection = async () => {
    try {
        const conn = await connection();
        console.log('Connected to database.');
        await conn.end();
    } catch (error) {
        console.error('Database connection failed: ' + error.stack);
    }
};
testConnection();

module.exports = connection;