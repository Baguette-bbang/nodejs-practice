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
    .route('/')
    // 장바구니 담기
    .post(
        []
        ,(req, res) => {
            res.json('장바구니 담기');
        }
    )
    // 장바구니 조회
    .get(
        []
        , (req, res) => {
            res.json('장바구니 조회');
        }
    )
    // 장바구니에서 선택한 주문 예상 상품 목록 조회
    .get(
        []
        , (req, res) => {
            res.json('장바구니 조회');
        }
    )


router
    .route('/:id')
    // 장바구니에서 선택한 주문 예상 상품 목록 조회
    .delete(
        []
        , (req, res) => {
            res.json('장바구니 도서 삭제');
        }
    );

module.exports = router;