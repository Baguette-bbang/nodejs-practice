const {StatusCodes, OK} = require('http-status-codes');
const connection = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // 암호화 모듈
const dotenv = require('dotenv');
dotenv.config();

const join = async (req, res) => {
    const conn = await connection();
    const {email, name, password, contact} = req.body;

    try {
        // 비밀번호 암호화
        const { salt, hashPassword } = hashUserPassword(password);
        const results = await joinByEmail(conn, name, email, hashPassword, contact, salt);

        return res.status(StatusCodes.CREATED).json(results);
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        await conn.end(); // 연결 종료
    }
};

const hashUserPassword = (password) => {
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
    return { salt, hashPassword };
};

const joinByEmail = async (conn, name, email, hashPassword, contact, salt) => {
    let sql = `INSERT INTO users (name, email, password, contact, salt) VALUES (?, ?, ?, ?, ?)`
    let values = [name, email, hashPassword, contact, salt];
    let [results] = await conn.execute(sql, values)
    return results
};

const login = async (req, res) => {
    const conn = await connection();
    const {email, password} = req.body;
    try {
        // 이메일을 통해서 로그인 유저 탐색
        const loginUser = await getUserByEmail(conn, email);
        const isPasswordValid = validatePassword(password, loginUser);

        if(loginUser && isPasswordValid) {
            const token = generateToken(loginUser)
            res.cookie("token", token, {
                httpOnly : true
            });
            return res.status(StatusCodes.OK).json(loginUser);
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message : `이메일 또는 비밀번호가 틀렸습니다.`
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        await conn.end(); // 연결 종료
    }    
}

const getUserByEmail = async (conn, email) => {
    let sql = `SELECT * FROM users WHERE email = ?`;
    let [loginUser] = await conn.execute(sql, [email])

    return loginUser[0];
};

const validatePassword = (password, loginUser) => {
    const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');
    return loginUser.password === hashPassword;
};

const generateToken = (loginUser) => {
    const token = jwt.sign({
            user_id : loginUser.id,
            email : loginUser.email,
            name : loginUser.name
        }, 
        process.env.PRIVATE_KEY, {
            expiresIn : '30m',
            issuer : 'Baguette-bbange'
        }
    )
    return token
};

const passwordResetRequest = (req, res) => {
    const {email} = req.body;
    let sql = `SELECT * FROM users WHERE email = ?`;
    let values = [email];

    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const [user] = results;
            if (user) {
                return res.status(StatusCodes.OK).json({
                    email : user.email
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
};

const passwordReset = (req, res) => {
    const {email, password} = req.body;

    let sql = `UPDATE users SET password = ?, salt = ?
                WHERE email=?`

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let values = [hashPassword, salt, email];

    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows === 0) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        }
    )
};

module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
};