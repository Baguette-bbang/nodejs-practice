const express = require('express');
const router = express.Router();
router.use(express.json());

const {param, validationResult} = require('express-validator');

const {
    getBooks, 
    bookDetail 
} = require('../controllers/BookController')

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
    // 전체 도서 조회 & 카테고리별 도서 목록 조회
    .get([
        validate
    ]
    , getBooks
    )
    


router
    .route('/:id')
    // 개별 도서 조회
    .get([
            param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
            validate
        ]
        , bookDetail
    );

module.exports = router;