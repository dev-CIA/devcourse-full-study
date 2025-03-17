const conn = require("../lib/mariadb");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("../util/errorHandler");

const addLike = (req, res) => {
  const { id: liked_book_id } = req.params;
  const { user_id } = req.body;

  const sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);`;
  const values = [user_id, liked_book_id];

  conn.query(sql, values, (err, results) => {
    if (errorHandler.isResError(err, res)) return;
    return res.status(StatusCodes.OK).json(results);
  });
};

const removeLike = (req, res) => {
  const { id: liked_book_id } = req.params;
  const { user_id } = req.body;

  const sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
  const values = [user_id, liked_book_id];

  conn.query(sql, values, (err, results) => {
    if (errorHandler.isResError(err, res)) return;
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { addLike, removeLike };
