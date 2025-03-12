const conn = require("../lib/mariadb");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("../util/errorHandler");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const join = (req, res) => {
  const { email, password, name } = req.body;

  const salt = crypto.randomBytes(64).toString("base64");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("base64");

  const sql = `INSERT INTO users (email, password, name, salt) VALUES (?, ?, ?, ?)`;
  const values = [email, hashedPassword, name, salt];

  conn.query(sql, values, (err, results) => {
    if (errorHandler.isResError(err, res)) return;
    if (results.affectedRows === 0)
      return res.status(StatusCodes.BAD_REQUEST).end();

    res.status(StatusCodes.CREATED).json({ message: `${name}님 환영합니다` });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM `users` WHERE email = ?";

  conn.query(sql, email, (err, results) => {
    if (errorHandler.isResError(err, res)) return;

    const loginUser = results ? results[0] : null;

    const hashedPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 100000, 64, "sha512")
      .toString("base64");

    if (loginUser && loginUser?.password === hashedPassword) {
      const token = jwt.sign(
        { email: loginUser.email, name: loginUser.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30m", // 토큰 만료 시간
          issuer: "meme", // 발급자
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      res.json({ message: `${loginUser.name}님 환영합니다` });
    }

    if (!loginUser || loginUser?.password !== hashedPassword)
      res.status(StatusCodes.UNAUTHORIZED).end();
  });
};
const requestPasswordReset = (req, res) => {
  const { email } = req.body;

  const sql = "SELECT * FROM `users` WHERE email = ?";
  conn.query(sql, email, (err, results) => {
    if (errorHandler.isResError(err, res)) return;

    const loginUser = results ? results[0] : null;
    if (loginUser) return res.status(StatusCodes.OK).json({ email });
    if (!loginUser) return res.status(StatusCodes.UNAUTHORIZED).end();
  });
};
const passwordReset = (req, res) => {
  const { email, password } = req.body;

  const sql = "UPDATE `users` SET password = ?, salt = ? WHERE email = ?";

  const salt = crypto.randomBytes(64).toString("base64");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("base64");

  const values = [hashedPassword, salt, email];
  conn.query(sql, values, (err, results) => {
    if (errorHandler.isResError(err, res)) return;

    if (results.affectedRows === 0)
      return res.status(StatusCodes.BAD_REQUEST).end();
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { join, login, requestPasswordReset, passwordReset };
