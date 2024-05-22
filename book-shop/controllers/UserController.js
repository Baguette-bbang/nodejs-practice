const {StatusCodes, OK} = require('http-status-codes');
const conn = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // 암호화 모듈
const dotenv = require('dotenv');
dotenv.config();

const join = (req, res) => {
    if (req.body == {}) {
        res.status(400).json({
            message : `입력 값을 다시 확인해 주시기 바랍니다.`
        })
    } else {
        const {email, name, password, contact} = req.body;
        // 비밀번호 암호화
        const salt = crypto.randomBytes(10).toString('base64');
        const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

        // 암호화된 비밀번호와 salt 값을 같이 db에 저장
        let sql = `INSERT INTO users (name, email, password, contact, salt) VALUES (?, ?, ?, ?, ?)`
        let values = [name, email, hashPassword, contact, salt];

        conn.query(sql, values,
            (err, results) => {
                if(err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                return res.status(StatusCodes.CREATED).json(results);
            }
        )
    }
}

const login = (req, res) => {
    const {email, password} = req.body;

    let sql = `SELECT * FROM users WHERE email = ?`
    let values = [email]

    conn.query(sql, values,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const [loginUser] = results;
            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');
            if (loginUser && loginUser.password === hashPassword) {
                const token = jwt.sign({
                        email : loginUser.email,
                        name : loginUser.name
                    }, process.env.PRIVATE_KEY, {
                        expiresIn : '30m',
                        issuer : 'Baguette-bbange'
                    }
                );

                res.cookie("token", token, {
                    httpOnly : true
                });

                return res.status(StatusCodes.OK).json({
                    // message : `${loginUser.name}님 로그인 되었습니다.`,
                    // token : token
                    results
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message : `이메일 또는 비밀번호가 틀렸습니다.`
                })
            }
        }
    );
}

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