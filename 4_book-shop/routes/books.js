const express = require("express");
const router = express.Router();
router.use(express.json());

// 도서 전체 조회
router.get("/", (req, res) => {
  res.json({ message: "도서 전체 조회" });
});

// 개별 도서 조회
router.get("/:id", (req, res) => {
  res.json({ message: "개별 도서 조회" });
});

// 카테코리별 도서 조회
router.get("/", (req, res) => {
  res.json({ message: "카테고리별 도서 조회" });
});

module.exports = router;
