const express = require('express');
const router = express.Router();

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

const conn = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const {body, param, validationResult} = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        next();
    } else {
        return res.status(400).json(errors.array());
    }
};


router
    .route('/join')
    // 회원 가입
    .post(
        [
            body('name').notEmpty().isString().withMessage('이름 확인 요망'),
            body('email').notEmpty().isEmail().withMessage('이메일 입력 요망'),
            body('password').notEmpty().isString().withMessage('비밀번호 확인 요망'),
            body('contact').notEmpty().isString().withMessage('전화번호 확인 요망'),
            validate
        ]
        ,(req, res) => {
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
                        res.status(201).json(results);
                    }
                )
            }
});


router
    .route('/login')
    // 로그인
    .post(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 입력 요망'),
            body('password').notEmpty().isString().withMessage('비밀번호 입력 요망'),
            validate
        ]
        , (req, res) => {
            const {email, password} = req.body;

            let sql = `SELECT * FROM users WHERE email = ?`
            let values = [email]

            conn.query(sql, values,
                (err, results) => {
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

                        res.status(200).json({
                            message : `${loginUser.name}님 로그인 되었습니다.`,
                            token : token
                        });
                    } else {
                        res.status(404).json({
                            message : `이메일 또는 비밀번호가 틀렸습니다.`
                        })
                    }

                }
            );
        }
    )


router
    .route('/reset')
    // 비밀번호 초기화 요청
    .post(
        []
        , (req, res) => {
        res.json('비밀번호 초기화 요청');
    })
    // 비밀번호 초기화
    .put(
        [], 
        (req, res) => {
            res.json('비밀번호 초기화');
    })

module.exports = router;