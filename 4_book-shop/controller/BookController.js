const conn = require("../lib/mariadb");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("../util/errorHandler");

const books = (req, res) => {
  const { category_id } = req.query;

  if (category_id) {
    const sql = `SELECT * FROM books WHERE category_id = ?`;

    conn.query(sql, category_id, (err, results) => {
      if (errorHandler.isResError(err, res)) return;

      const books = results.length ? results : null;

      if (!books) return res.status(StatusCodes.NOT_FOUND).end();

      res.status(StatusCodes.OK).json(results);
    });
    return;
  }
  const sql = `SELECT * FROM books`;

  conn.query(sql, (err, results) => {
    if (errorHandler.isResError(err, res)) return;

    res.status(StatusCodes.OK).json(results);
  });
};

const bookDetail = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM books WHERE id = ?`;

  conn.query(sql, id, (err, results) => {
    if (errorHandler.isResError(err, res)) return;

    const bookDetail = results[0] ?? null;

    if (!bookDetail) return res.status(StatusCodes.NOT_FOUND).end();

    res.status(StatusCodes.OK).json(results);
  });
};
const booksByCategory = (req, res) => {};

module.exports = { books, bookDetail, booksByCategory };
