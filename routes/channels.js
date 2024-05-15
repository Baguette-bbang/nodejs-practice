const express = require('express');
const router = express.Router();
router.use(express.json());
const conn = require('../db/mariadb');
const {body, param, validationResult} = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    next();
};

router
    .route('/')
    .post(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력 요망'),
            body('name').notEmpty().isString().withMessage('문자 입력 요망'),
            validate
        ]
        ,(req, res, next) => { // 채널 개별 생성

            const {name, userId} = req.body;
            let sql = `INSERT INTO channels (name, user_id) VALUES (?, ?)`;
            let values = [name, userId];
    
            conn.query(sql, values,
                function(err, results){
                    if(err) {
                        console.log(err)
                        return res.status(500).end();
                    } if (results.affectedRows == 0) {
                        return res.status(404).end();
                    } else {
                        return res.status(200).json(results);
                    }
                }
            );
        } 
    )
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력 요망'),
            validate
        ]
        , (req, res, next) => { // 특정 회원의 채널 전체 조회

        var {userId} = req.body;
        let sql = `SELECT * FROM channels WHERE user_id = ?`;

        conn.query(sql, userId,
            function(err, results) {
                if(err) {
                    console.log(err)
                    return res.status(500).end();
                }
                if (results.length === 0) {
                    return res.status(404).json({ message: '채널을 찾을 수 없습니다.' });
                }
                return res.status(200).json(results);
            }
        )
    })

router
    .route('/:id')
    .get(
        [
            param('id').notEmpty().withMessage('채널 id 입력 요망'),
            validate
        ]
        , (req, res, next) => { // 채널 개별 조회

            let {id} = req.params
            id = parseInt(id);
            
            let sql = `SELECT * FROM channels WHERE id = ?`;

            conn.query(sql, id,
                function(err, results) {
                    if(err) {
                        console.log(err);
                        return res.status(400).end();
                    }
                    if (results.length === 0) {
                        return res.status(404).json({ message: '채널을 찾을 수 없습니다.' });
                    }
                    return res.status(200).json(results);
                }
            )
        }
    ) 
    .put(
        [
            param('id').notEmpty().withMessage('채널 id 입력 요망'),
            body('name').notEmpty().isString().withMessage('채널명 오류'),
            validate
        ]
        , (req, res, next) => { // 채널 개별 조회

            let {id} = req.params;
            id = parseInt(id);
            let {name} = req.body;
            
            let sql = `UPDATE channels SET name=?
                        WHERE id=?`;
            let values = [name, id];

            conn.query(sql, values,
                function(err, results) {
                    if(err) {
                        console.log(err);
                        return res.status(400).end();
                    }
                    if (results.affectedRows == 0) {
                        return res.status(400).end();
                    } else {
                        return res.status(200).json(results);
                    }
                }
            )
        }
    ) 
    .delete(
        [
            param('id').notEmpty().withMessage('채널 id 입력 요망'),
            validate
        ]
    , (req, res, next) => { // 채널 개별 조회

        let {id} = req.params;
        id = parseInt(id);
        let {name} = req.body;
        
        let sql = `DELETE FROM channels WHERE id = ?`;

        conn.query(sql, id,
            function(err, results) {
                if(err) {
                    console.log(err);
                    return res.status(500).end();
                }
                if (results.affectedRows == 0) {
                    return res.status(404).end();
                } else {
                    return res.status(200).json(results);
                }
            }
        )
    }
) 
function notFoundChannel(res) {
    res.status(404).json({
        message : `채널 정보를 찾을 수 없습니다.`
    });
}
module.exports = router;