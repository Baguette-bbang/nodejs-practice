const {StatusCodes, OK} = require('http-status-codes');
const conn = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const join = (req, res) => {
    if (req.body == {}) {
        res.status(400).json({
            message : `입력 값을 다시 확인해 주시기 바랍니다.`
        })
    } else {
        const {email, name, password, contact} = req.body;
        let sql = `INSERT INTO users (name, email, password, contact) VALUES (?, ?, ?, ?)`
        let values = [name, email, password, contact];

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
            if (loginUser && loginUser.password === password) {
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
                    message : `${loginUser.name}님 로그인 되었습니다.`,
                    token : token
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

    let sql = `UPDATE users SET password = ?
                WHERE email=?`;
    let values = [password, email];

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