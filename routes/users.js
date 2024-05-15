const express = require('express');
const router = express.Router();
const conn = require('../db/mariadb');
const {body, param, validationResult} = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    } else {
        return res.status(400).json(errors.array());
    }
};

router.use(express.json()); // Http 외의 모듈 사용하겠다 명시 그 중에서도 'json', post 사용 시 선언

// 로그인
router.post(
    '/login', 
    [
        body('email').notEmpty().isEmail().withMessage('이메일 입력 요망'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 요망'),
        validate
    ],
    function(req, res, next){
        const {email, password} = req.body;

        let sql = `SELECT * FROM users WHERE email = ?`;
        let values = [email]

        conn.query(sql, values,
            function(err, results) {
                var loginUser = results[0];

                if(loginUser && loginUser.password === password) {
                    res.status(200).json({
                        message : `${loginUser.name}님 로그인 되었습니다.`
                    })
                } else {
                    res.status(404).json({
                        message : "이메일 또는 비밀번호가 틀렸습니다."
                    });
                } 
            }
        )
}); 

// 회원가입
router.post(
    '/join', 
    [
        body('email').notEmpty().isEmail().withMessage('이메일 입력 요망'),
        body('name').notEmpty().isString().withMessage('이름 확인 요망'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 요망'),
        body('contact').notEmpty().isString().withMessage('전화번호 확인 요망'),
        validate
    ],
    function(req, res){
        if (req.body == {}) {
            res.status(400).json({
                message : `입력 값을 다시 확인해 주시기 바랍니다.`
            });
        } else {
            const {email, name, password, contact} = req.body;
            let sql = 'INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)';
            let values = [email, name, password, contact];

            conn.query(sql, values,
                function(err, results, fields) {
                    res.status(201).json(results);
                }
            );
        }
});

router
    .route('/users')
    .get(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 입력 요망'),
            validate
        ]
        , function(req, res){ // 개별 조회
            let {email} = req.body;
            let sql = 'SELECT * FROM users WHERE email = ?';
            let values = [email];
            
            conn.query(sql, values,
                function(err, results, fields) {
                    if(results && results.length) {
                        res.status(200).json(results);
                    } else {
                        res.status(404).json({
                            message : "해당하는 회원 정보가 없습니다."
                        });
                    }
                }
            );
    })
    .delete(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 입력 요망'),
            validate
        ]
        , function(req, res){ // 개별 탈퇴
        let { email } = req.body;
        let sql = 'DELETE FROM users WHERE email = ?';
        let values = [email];

        conn.query(sql, values,
            function(err, results, fields) {
                if (err) {
                    console.error('SQL error:', err);
                    return res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: "해당하는 회원 정보가 없습니다." });
                } else {
                    return res.status(200).json({ message: "회원 탈퇴가 성공적으로 처리되었습니다." });
                }
            }
        );
    })

module.exports = router;