const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req) => {
    try {
        let receivedJwt = req.headers["authorization"];
        if (!receivedJwt) {
            throw new Error('토큰이 제공되지 않았습니다.');
        }
        let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
        return decodedJwt;
    } catch (err) {
        throw err;
    }
}

module.exports = ensureAuthorization;