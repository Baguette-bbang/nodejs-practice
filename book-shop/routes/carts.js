const express = require('express');
const router = express.Router();

router.use(express.json());

const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

const {
    addToCart,
    removeCartItem,
    getCartItem
} = require('../controllers/CartController');

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
        [validate]
        ,addToCart
    )
    // 장바구니 조회 // 장바구니에서 선택한 주문 예상 상품 목록 조회
    .get(
        [validate]
        , getCartItem
    )
    



router
    .route('/:id')
    // 장바구니에 있는 아이템 삭제
    .delete(
        []
        , removeCartItem
    );

module.exports = router;