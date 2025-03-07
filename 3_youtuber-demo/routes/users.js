const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const conn = require("../mariadb");
const {
  body,
  param,
  validateHandler,
  isResError,
} = require("../utils/validate");

dotenv.config();

const router = express.Router();
router.use(express.json());

// 로그인
router.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("이메일이 필요합니다."),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("비밀번호가 필요합니다."),
    validateHandler,
  ],
  (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM `users` WHERE email = ?";

    conn.query(sql, email, (err, results) => {
      const loginUser = results ? results[0] : null;

      if (loginUser && loginUser?.password === password) {
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
        console.log("token: ", token);

        res.json({ message: `${loginUser.name}님 환영합니다` });
      }

      if (!loginUser || loginUser?.password !== password)
        res.status(403).json({ message: "회원 정보를 잘못 입력하셨습니다." });
    });
  }
);

// 회원가입
router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일이 필요합니다."),
    body("name").notEmpty().isString().withMessage("이름이 필요합니다."),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("비밀번호가 필요합니다."),
    body("contact").optional().isString().withMessage("연락처 확인 필요"),
    validateHandler,
  ],
  (req, res) => {
    const { email, name, password, contact } = req.body;

    const sql =
      "INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)";
    const values = [email, name, password, contact];

    conn.query(sql, values, (err, results) => {
      if (isResError(err, res)) return;
      if (results.affectedRows === 0) return res.status(400).end();

      res.status(201).json({ message: `${name}님 환영합니다` });
    });
  }
);

router
  .route("/users")
  // 회원 개별 조회
  .get(
    [
      body("email").notEmpty().isEmail().withMessage("이메일이 필요합니다."),
      validateHandler,
    ],
    (req, res) => {
      const { email } = req.body;

      const sql = "SELECT * FROM `users` WHERE email = ?";

      conn.query(sql, email, (err, results) => {
        if (isResError(err, res)) return;
        if (results.affectedRows === 0) return res.status(400).end();

        if (results.length) res.status(200).json(results);
        if (!results.length)
          res.status(404).json({ message: "회원 정보가 없습니다." });
      });
    }
  )
  // 회원 탈퇴
  .delete(
    [
      body("email").notEmpty().isEmail().withMessage("이메일이 필요합니다."),
      validateHandler,
    ],
    (req, res) => {
      const { email } = req.body;

      const sql = "DELETE FROM users WHERE email = ?";

      conn.query(sql, email, (err, results) => {
        if (isResError(err, res)) return;
        if (results.affectedRows === 0) return res.status(400).end();

        res.status(200).json(results);
      });
    }
  );

module.exports = router;
