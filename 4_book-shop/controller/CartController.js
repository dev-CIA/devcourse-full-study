const conn = require("../lib/mariadb");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("../util/errorHandler");

const addToCart = (req, res) => {
  const { book_id, quantity, user_id } = req.body;

  const sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;
  const values = [book_id, quantity, user_id];

  conn.query(sql, values, (err, results) => {
    if (errorHandler.isResError(err, res)) return;
    return res.status(StatusCodes.OK).json(results);
  });
};

const getCartItems = (req, res) => {
  const { user_id, selected } = req.body;
  const values = [user_id];

  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
                FROM BookShop.cartItems
                LEFT JOIN books ON cartItems.book_id = books.id
                WHERE user_id = ?`;

  if (selected) {
    sql += ` AND cartItems.id IN (?)`;
    values.push(selected);
  }

  conn.query(sql, values, (err, results) => {
    if (errorHandler.isResError(err, res)) return;
    return res.status(StatusCodes.OK).json(results);
  });
};

const removeCartItem = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM cartItems WHERE id = ?`;

  conn.query(sql, id, (err, results) => {
    if (errorHandler.isResError(err, res)) return;
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { addToCart, getCartItems, removeCartItem };
