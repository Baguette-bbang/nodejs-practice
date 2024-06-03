const {StatusCodes} = require('http-status-codes');
const connection = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const ensureAuthorization = require('../auth.js'); // 인증 모듈

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

        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: '토큰이 유효하지 않거나 만료되었습니다.' });
        }
        
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
    } catch (err) {
        console.error(err);

        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: '토큰이 유효하지 않거나 만료되었습니다.' });
        }
        
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

module.exports = {
    addLike,
    removeLike
};