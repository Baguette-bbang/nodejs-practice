const {StatusCodes} = require('http-status-codes');
const connection = require('../db/mariadb');

const allCategories  = async (req, res) => {
    const conn = await connection();
    try {
        let sql = "SELECT * FROM categories";
        const [results] = await conn.execute(sql);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
}
module.exports = {
    allCategories
};