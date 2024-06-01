const {StatusCodes} = require('http-status-codes');
const connection = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const addLike = async (req, res) => {
    const {id} = req.params;
    const conn = await connection();
    try {
        
        const authorization = ensureAuthorization(req);
        const {user_id} = authorization;

        let sql = "INSERT INTO likes (user_id, book_id) VALUES (?, ?)";
        let values = [user_id, id];

        const results = await conn.execute(sql, values)
        return res.status(StatusCodes.OK).json(results[0]);
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const removeLike = async (req, res) => {
    const {id} = req.params;
    const conn = await connection();

    try {
        const authorization = ensureAuthorization(req);
        const {user_id} = authorization;

        let sql = "DELETE FROM likes WHERE user_id = ? AND book_id = ?";
        let values = [user_id, id];

        const results = await conn.execute(sql, values)
        return res.status(StatusCodes.OK).json(results[0]);
    } catch (error) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const ensureAuthorization = (req) => {
    let receivedJwt = req.headers["authorization"];
    let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

    return decodedJwt
}

module.exports = {
    addLike,
    removeLike
};