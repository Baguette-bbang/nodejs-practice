const express = require('express');
const router = express.Router();

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

const conn = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const {body, param, validationResult} = require('express-validator');
const {addLike, removeLike} = require('../controllers/LikeController');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        next();
    } else {
        return res.status(400).json(errors.array());
    }
};

router
    .route('/:id')
    // 좋아요 추가
    .post(
        []
        , addLike
    )
    // 좋아요 삭제
    .delete(
        []
        , removeLike
    );

module.exports = router;