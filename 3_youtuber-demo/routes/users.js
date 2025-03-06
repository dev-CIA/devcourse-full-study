const express = require("express");
const conn = require("../mariadb");

const router = express.Router();
router.use(express.json());

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM `users` WHERE email = ?";

  conn.query(sql, email, (err, results) => {
    const loginUser = results ? results[0] : null;

    if (loginUser && loginUser?.password === password)
      res.json({ message: `${loginUser.name}님 환영합니다` });

    if (!loginUser || loginUser?.password !== password)
      res.status(404).json({ message: "회원 정보를 잘못 입력하셨습니다." });
  });
});

router.post("/join", (req, res) => {
  const { email, name, password, contact } = req.body;

  const sql =
    "INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)";
  const values = [email, name, password, contact];

  conn.query(sql, values, (err, results) => {
    res.status(201).json({ message: `${name}님 환영합니다` });
  });
});

router
  .route("/users")
  .get((req, res) => {
    const { email } = req.body;

    const sql = "SELECT * FROM `users` WHERE email = ?";

    conn.query(sql, email, (err, results) => {
      if (results.length) res.status(200).json(results);
      if (!results.length)
        res.status(404).json({ message: "회원 정보가 없습니다." });
    });
  })
  .delete((req, res) => {
    const { email } = req.body;

    const sql = "DELETE FROM users WHERE email = ?";

    conn.query(sql, email, (err, results) => {
      res.status(200).json(results);
    });
  });

module.exports = router;
