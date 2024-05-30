const {StatusCodes} = require('http-status-codes');
const connection = require('../db/mariadb');
const dotenv = require('dotenv');
dotenv.config();

const order = async (req, res) => {
    const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;
    const conn = await connection();
    try {
        await conn.beginTransaction(); // 트랜잭션 시작

        let deliverySql = `INSERT INTO deliveries (address, receiver, contact) VALUES (?, ?, ?)`;
        let deliveryValues = [delivery.address, delivery.receiver, delivery.contact];    
        const [deliveryResults] = await conn.execute(deliverySql, deliveryValues);
        const delivery_id = deliveryResults.insertId;

        let orderSql = `INSERT INTO orders (total_quantity, total_price, user_id, delivery_id, first_book_title) VALUES (?, ?, ?, ?, ?)`;
        let orderValues = [totalQuantity, totalPrice, userId, delivery_id, firstBookTitle];
        const [orderResults] = await conn.execute(orderSql, orderValues);
        const order_id = orderResults.insertId;
        
        // items를 통해, 장바구니에서 book_id, quantity를 조회
        let cartSql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
        const [orderItems] = await conn.query(cartSql, [items]);

        let obSql = `INSERT INTO orderedBooks (order_id, book_id, quantity) VALUES ?`;
        let obValues = orderItems.map(item => [order_id, item.book_id, item.quantity]);
        await conn.query(obSql, [obValues]);

        await deleteCartItems(conn, items);

        await conn.commit(); // 트랜잭션 커밋
        return res.status(StatusCodes.OK).json({ order_id });

    } catch (err) {
        await conn.rollback(); // 트랜잭션 롤백
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        await conn.end(); // 연결 종료
    }
};

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;
    const [result] = await conn.query(sql, [items]);
    return result;
}

const getOrders = async (req, res) => {
    const conn = await connection();
    try {
        
        await conn.beginTransaction(); // 트랜잭션 시작

        let sql = `SELECT orders.id, book_title, total_quantity, total_price, ordered_at,
                        address, receiver, contact
                    FROM orders LEFT JOIN deliveries
                    ON orders.delivery_id = delivery_id;`
        let [rows, fields] = await conn.query(sql);
        return res.status(StatusCodes.OK).json(rows);
    } catch (err) {
        await conn.rollback(); // 트랜잭션 롤백
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        await conn.end(); // 연결 종료
    }
}

const getOrderDetail = async (req, res) => {
    const {id} = req.params;
    const conn = await connection();
    try {
        await conn.beginTransaction(); // 트랜잭션 시작

        let sql = `SELECT book_id, title, author, price, quantity
                    FROM orderedBooks LEFT JOIN books
                    ON orderedBooks.book_id = books.id
                    WHERE order_id = ?`;
        let [rows, fields] = await conn.query(sql, [parseInt(id)]);
        return res.status(StatusCodes.OK).json(rows);
    } catch (err) {
        await conn.rollback(); // 트랜잭션 롤백
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        await conn.end(); // 연결 종료
    }
}

module.exports = {
    order,
    getOrders,
    getOrderDetail
};