const express = require('express');
const router = express.Router();
const conn = require('../db/mariadb');

router.use(express.json()); // Http 외의 모듈 사용하겠다 명시 그 중에서도 'json', post 사용 시 선언

// 로그인
router.post('/login', function(req, res){
    // console.log(req.body);
    // userId가 db에 저장된 회원인지 확인
    const {email, password} = req.body;
    var loginUser = {};
    let sql = `SELECT * FROM users WHERE email = ?`;
    let values = [email]

    conn.query(sql, values,
        function(err, results, fields) {
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
router.post('/join', function(req, res){
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
    .get(function(req, res){ // 개별 조회
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
    .delete(function(req, res){ // 개별 탈퇴
        let { email } = req.body;
        let sql = 'DELETE FROM users WHERE email = ?';
        let values = [email];

        conn.query(sql, values,
            function(err, results, fields) {
                if (err) {
                    console.error('SQL error:', err);
                    return res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
                }
                if (results.affectedRows > 0) {
                    res.status(200).json({ message: "회원 탈퇴가 성공적으로 처리되었습니다." });
                } else {
                    res.status(404).json({ message: "해당하는 회원 정보가 없습니다." });
                }
            }
        );
    })

module.exports = router;