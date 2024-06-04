const {StatusCodes} = require('http-status-codes');
const connection = require('../db/mariadb');
const jwt = require('jsonwebtoken');
const ensureAuthorization = require('../auth.js'); // 인증 모듈

const getBooks = async (req, res) => {
    const conn = await connection();
    try {
        let {category_id, news, limit, currentPage} = req.query;
        currentPage = parseInt(currentPage)
        category_id = parseInt(category_id);

        let offset = limit * (currentPage - 1);

        let sql = `SELECT SQL_CALC_FOUND_ROWS *, 
                    (SELECT count(*) 
                        FROM likes 
                        WHERE book_id = books.id
                    ) AS likes
                    FROM books`;
        let values = [];
        
        if (category_id && news) {
            sql += ` WHERE category_id = ? and pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
            values = [category_id];
        } 
        else if (category_id) {
            sql += ' WHERE category_id = ?';
            values = [category_id];
        } else if (news) {
            sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        }
        sql += ` LIMIT ? OFFSET ?`;
        values.push(parseInt(limit), offset);
        
        const [rows] = await conn.execute(sql, values);
        
        let paginationSql = 'SELECT count(*) as totalCount FROM books'
        const [totalCount] = await conn.execute(paginationSql);
        let pagination = {
            totalCount : totalCount[0].totalCount,
            currentPage : currentPage
        }

        return res.status(StatusCodes.OK).json({
            books : rows,
            pagination : pagination
        });
    } catch (err) {
        console.error(err);

        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: '토큰이 유효하지 않거나 만료되었습니다.' });
        }

        return res.status(StatusCodes.BAD_REQUEST).end();
        
    } finally {
        await conn.end(); // 연결 종료
    }
}

const bookDetail = async (req, res) => {
    let conn;
    try {
        conn = await connection();
        let authorization;
        try {
            authorization = ensureAuthorization(req);
        } catch (err) {
            if (err instanceof ReferenceError) {
                // 로그인하지 않은 사용자의 경우
                const book_id = req.params.id;
                const sql = `
                    SELECT *, 
                    (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes 
                    FROM books 
                    LEFT JOIN categories ON books.category_id = categories.id 
                    WHERE books.id = ?`;
                
                const [rows] = await conn.execute(sql, [book_id]);
                return res.status(StatusCodes.OK).json(rows);
            } else {
                // JWT 관련 에러
                if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
                    return res.status(StatusCodes.UNAUTHORIZED).json({ message: '토큰이 유효하지 않거나 만료되었습니다.' });
                }
                throw err; // 그 외 에러는 상위 catch로 전달
            }
        }
        
        // 로그인한 사용자의 경우 처리 로직
        const book_id = req.params.id;
        const sql = `
            SELECT *, 
                    (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes, 
                    (SELECT EXISTS(SELECT * FROM likes WHERE user_id = ? AND book_id = ?)) as liked 
            FROM books 
            LEFT JOIN categories ON books.category_id = categories.id 
            WHERE books.id = ?`;
        const values = [authorization.user_id, book_id, book_id];
        
        const [rows] = await conn.execute(sql, values);
        return res.status(StatusCodes.OK).json(rows);
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) {
            await conn.end(); // 연결 종료
        }
    }
}

const booksByCategory = async (req, res) => {
    const conn = await connection();
    try {
        let {category_id} = req.query;
        let sql = `SELECT * FROM books WHERE category_id = ?`;
        let values = [category_id];
    
        const [rows] = conn.execute(sql, values);

        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        await conn.end(); // 연결 종료
    }
}

module.exports = {
    getBooks,
    bookDetail,
    booksByCategory
};