const conn = require("../lib/mariadb");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("../util/errorHandler");

const allCategory = (req, res) => {
  const sql = `SELECT * FROM category`;

  conn.query(sql, (err, results) => {
    if (errorHandler.isResError(err, res)) return;

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { allCategory };
