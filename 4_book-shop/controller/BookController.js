const conn = require("../lib/mariadb");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("../util/errorHandler");

const books = (req, res) => {
  const { category_id, news, limit, current_page } = req.query;
  const offset = limit * (current_page - 1);

  let sql = `SELECT * , (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books`;
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
  const { user_id } = req.body;
  const { id: book_id } = req.params;
  const values = [user_id, book_id];

  const sql = `SELECT *, 
	                (SELECT count(*) FROM BookShop.likes WHERE liked_book_id = books.id) AS likes,
	                (SELECT EXISTS (SELECT * FROM BookShop.likes WHERE user_id = ? AND liked_book_id = books.id)) AS LIKED 
                  FROM BookShop.books
                  LEFT JOIN category
                  ON books.category_id = category.category_id
                  WHERE books.id = ?`;

  conn.query(sql, values, (err, results) => {
    if (errorHandler.isResError(err, res)) return;

    const bookDetail = results[0] ?? null;

    if (!bookDetail) return res.status(StatusCodes.NOT_FOUND).end();

    res.status(StatusCodes.OK).json(results);
  });
};
const booksByCategory = (req, res) => {};

module.exports = { books, bookDetail, booksByCategory };
