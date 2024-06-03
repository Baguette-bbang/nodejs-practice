const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');

const {
    join, 
    login, 
    passwordResetRequest, 
    passwordReset
} = require('../controllers/UserController')

router.use(express.json());

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
    .post([
        body('name').notEmpty().isString().withMessage('이름 확인 요망'),
        body('email').notEmpty().isEmail().withMessage('이메일 입력 요망'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 요망'),
        body('contact').notEmpty().isString().withMessage('전화번호 확인 요망'),
        validate
    ]
    , join);


router
    .route('/login')
    // 로그인
    .post(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 입력 요망'),
            body('password').notEmpty().isString().withMessage('비밀번호 입력 요망'),
            validate
        ]
        , login
    )


router
    .route('/reset')
    // 비밀번호 초기화 요청
    .post(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 입력 요망'),
            validate
        ]
        , passwordResetRequest)
    // 비밀번호 초기화
    .put(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 입력 요망'),
            body('password').notEmpty().isString().withMessage('비밀번호 입력 요망'),
            validate
        ]
        , passwordReset)

module.exports = router;