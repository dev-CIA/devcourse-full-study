const express = require("express");
const router = express.Router();
router.use(express.json());
const { books, bookDetail } = require("../controller/BookController");

router.get("/", books);
router.get("/:id", bookDetail);

module.exports = router;
