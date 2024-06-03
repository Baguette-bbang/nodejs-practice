const {StatusCodes} = require('http-status-codes');
const conn = require('../db/mariadb');

const allCategories  = (req, res) => {
    let sql = "SELECT * FROM categories";
    conn.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(results);
    })
}

module.exports = {
    allCategories
};