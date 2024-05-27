const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

const {body, param, validationResult} = require('express-validator');

const {
    allCategories
} = require('../controllers/CategoryController')

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
    .get([validate], allCategories);

module.exports = router;