const {StatusCodes} = require('http-status-codes');
const conn = require('../db/mariadb');
const dotenv = require('dotenv');
dotenv.config();

const getBooks = (req, res) => {
    if (req.query.category_id) {
        booksByCategory(req, res);
    } else {
        allBooks(req, res);
    }
}

const allBooks = (req, res) => {
    let sql = `SELECT id, title, category_id, summary, author, price, pubDate FROM books`;

    conn.query(sql, [], 
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if (results) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        }
    );
}

const bookDetail = (req, res) => {
    var {id} = req.params;
    id = parseInt(id);
    let sql = `SELECT * FROM books WHERE id = ?`;
    let values = [id]

    conn.query(sql, values, 
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            } 
            if (results[0]) {
                return res.status(StatusCodes.OK).json(results[0]);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
            
        }
    );
}

const booksByCategory = (req, res) => {
    let {category_id} = req.query;
    let sql = `SELECT * FROM books WHERE category_id = ?`;
    let values = [category_id];

    conn.query(sql, values,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            if (results.length) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        }
    )
}

module.exports = {
    getBooks,
    bookDetail
};