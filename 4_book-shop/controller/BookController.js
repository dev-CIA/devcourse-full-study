const conn = require("../lib/mariadb");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("../util/errorHandler");

const books = (req, res) => {
  const { category_id, news, limit, current_page } = req.query;
  const offset = limit * (current_page - 1);

  let sql = `SELECT * FROM books`;
  const values = [];

  if (category_id) {
    sql += ` WHERE category_id = ?`;
    values.push(category_id);
  }

  if (category_id && news)
    sql += ` AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;

  if (!category_id && news)
    sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;

  sql += ` LIMIT ? OFFSET ?`;
  values.push(+limit, +offset);

  conn.query(sql, values, (err, results) => {
    if (errorHandler.isResError(err, res)) return;

    const books = results.length ? results : null;

    if (!books) return res.status(StatusCodes.NOT_FOUND).end();

    res.status(StatusCodes.OK).json(results);
  });
};

const bookDetail = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM BookShop.books LEFT JOIN category 
                ON books.category_id = category.id WHERE books.id = ?`;

  conn.query(sql, id, (err, results) => {
    if (errorHandler.isResError(err, res)) return;

    const bookDetail = results[0] ?? null;

    if (!bookDetail) return res.status(StatusCodes.NOT_FOUND).end();

    res.status(StatusCodes.OK).json(results);
  });
};
const booksByCategory = (req, res) => {};

module.exports = { books, bookDetail, booksByCategory };
