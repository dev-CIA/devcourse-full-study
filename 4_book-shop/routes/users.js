const express = require("express");
const router = express.Router();
const conn = require("../lib/mariadb");
const {
  join,
  login,
  requestPasswordReset,
  passwordReset,
} = require("../controller/UserController");

const { validateHandler, body } = require("../middleware/validate");

router.use(express.json());

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
    validateHandler,
  ],
  join
);

// 로그인
router.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("이메일이 필요합니다."),
    validateHandler,
  ],
  login
);

// 비밀번호 초기화 요청
router.post("/reset", requestPasswordReset);

// 비밀번호 초기화
router.put("/reset", passwordReset);

module.exports = router;
