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
    .route('/:id')
    // 좋아요 추가
    .post(
        []
        ,(req, res) => {
            res.json('좋아요 추가');
    
        }
    )
    // 좋아요 삭제
    .delete(
        []
        , (req, res) => {
            res.json('좋아요 삭제');
        }
    )

module.exports = router;