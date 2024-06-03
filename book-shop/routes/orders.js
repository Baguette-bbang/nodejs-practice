const express = require('express');
const router = express.Router();
router.use(express.json());

const {validationResult} = require('express-validator');
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
        [validate]
        ,order
    )
    // 주문 목록 조회
    .get(
        [validate]
        , getOrders
    )

router
    .route('/:id')
    // 주문 상세 상품 조회
    .get(
        [validate]
        , getOrderDetail
    )

module.exports = router;