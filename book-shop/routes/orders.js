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
    // 주문 하기
    .post(
        []
        ,(req, res) => {
            res.json('주문 하기');
        }
    )
    // 주문 목록 조회
    .get(
        []
        ,(req, res) => {
            res.json('주문 목록 조회');
        }
    )

router
    .route('/:id')
    // 주문 상세 상품 조회
    .get(
        []
        , (req, res) => {
            res.json('주문 상세 상품 조회');
        }
    )

module.exports = router;