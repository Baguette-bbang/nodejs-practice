const express = require('express');
const router = express.Router();

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

const conn = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const {body, param, validationResult} = require('express-validator');

const {order, getOrders, getOrderDetail} = require('../controllers/OrderController')

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
        ,order
    )
    // 주문 목록 조회
    .get(
        []
        , getOrders
    )

router
    .route('/:id')
    // 주문 상세 상품 조회
    .get(
        []
        , getOrderDetail
    )

module.exports = router;