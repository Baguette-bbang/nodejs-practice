const {StatusCodes} = require('http-status-codes');
const connection = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const addLike = async (req, res) => {
    const {id} = req.params;
    const conn = await connection();
    try {
        let receivedJwt = req.headers["authorization"];
        console.log(receivedJwt);
        let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
        console.log(decodedJwt);

        // decodedJwt에서 id 받아오기 
        const {user_id} = decodedJwt;
        let sql = "INSERT INTO likes (user_id, book_id) VALUES (?, ?)";
        let values = [user_id, id];

        const results = await conn.execute(sql, values)
        return res.status(StatusCodes.OK).json(results[0]);
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const removeLike = (req, res) => {
    const {id} = req.params;
    const {user_id} = req.body;

    let sql = "DELETE FROM likes WHERE user_id = ? AND book_id = ?";
    let values = [user_id, parseInt(id)];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(results);
    })
};

module.exports = {
    addLike,
    removeLike
};