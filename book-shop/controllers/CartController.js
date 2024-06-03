const {StatusCodes} = require('http-status-codes');
const connection = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const ensureAuthorization = require('../auth.js'); // 인증 모듈

const addToCart = async (req, res) => {
    const conn = await connection();
    const {book_id, quantity} = req.body;
    
    try {
        const {user_id} = ensureAuthorization(req);    
        let sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)";
        let values = [book_id, quantity, user_id];
        const results = await conn.execute(sql, values);

        return res.status(StatusCodes.OK).json(results[0]);
    } catch (err) {
        console.error(err);

        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: '토큰이 유효하지 않거나 만료되었습니다.' });
        }
        
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        await conn.end(); // 연결 종료
    }
};

const getCartItem = async (req, res) => {
    const conn = await connection();
    const {selected} = req.body; // selected = [cartItemsId1, cartItemsId2...]

    try {
        const {user_id} = ensureAuthorization(req);
        // 기본적으로는 사용자 장바구니 목록 조회 (장바구니에 들어가는 가서 내가 고른 아이템들 조회하는 것)
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price, price*quantity as total_price
            FROM cartItems
            JOIN books ON(cartItems.book_id = books.id)
            WHERE user_id = ?`;
        let values = [user_id];   

        if (selected) { // 주문서 작성 시 '선택한 장바구니 목록 조회' (장바구니에서 주문할 아이템들을 체크하고 주문서를 작성하는 것)
            sql += ` AND cartItems.id IN (?)`;
            values.push(selected);
        }

        const [results] = await conn.query(sql, values);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.error(err);

        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: '토큰이 유효하지 않거나 만료되었습니다.' });
        }

        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        await conn.end(); // 연결 종료
    }
};

const removeCartItem = async (req, res) => {
    const conn = await connection();
    const cartItemId = req.params.id;
    try {
        let sql = `DELETE FROM cartItems WHERE id = ?`
        const [results] = await conn.execute(sql, [cartItemId]);

        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        await conn.end(); // 연결 종료
    }
};

module.exports = {
    addToCart,
    removeCartItem,
    getCartItem
};