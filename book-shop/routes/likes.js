const express = require('express');
const router = express.Router();
router.use(express.json());

const {validationResult} = require('express-validator');
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
        [validate]
        , addLike
    )
    // 좋아요 삭제
    .delete(
        [validate]
        , removeLike
    );

module.exports = router;