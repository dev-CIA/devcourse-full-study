const express = require("express");
const conn = require("../mariadb");
const {
  body,
  param,
  validateHandler,
  isResError,
} = require("../utils/validate");

const router = express.Router();
router.use(express.json());

router
  .route("/")
  // 채널 전체 조회
  .get(
    [
      body("user_id")
        .notEmpty()
        .isNumeric()
        .withMessage("로그인이 필요합니다."),
      validateHandler,
    ],
    (req, res) => {
      const { user_id } = req.body;

      const sql = "SELECT * FROM `channels` WHERE user_id = ?";

      conn.query(sql, user_id, (err, results) => {
        if (isResError(err, res)) return;

        if (results?.length === 0) notFoundChannel(res);
        if (results?.length) res.json(results);
      });
    }
  )
  // 채널 생성
  .post(
    [
      body("user_id").notEmpty().isNumeric().withMessage("숫자여야합니다."),
      body("name").notEmpty().isString().withMessage("문자 입력 필요"),
      validateHandler,
    ],
    (req, res) => {
      const { name, user_id } = req.body;

      const sql = "INSERT INTO channels (name,  user_id) VALUES (?, ?)";
      const values = [name, user_id];

      conn.query(sql, values, (err, results) => {
        if (isResError(err, res)) return;

        res.status(201).json({ message: `${name} 채널을 응원합니다.` });
      });
    }
  );

router
  .route("/:id")
  .get(
    [param("id").notEmpty().withMessage("채널 ID 필요"), validateHandler],
    (req, res) => {
      const { id } = req.params;

      const sql = "SELECT * FROM `channels` WHERE id = ?";

      conn.query(sql, id, (err, results) => {
        if (isResError(err, res)) return;

        if (results.length) res.status(200).json(results);
        if (!results.length) notFoundChannel(res);
      });
    }
  )
  .put(
    [
      param("id").notEmpty().withMessage("채널 ID 필요"),
      body("name").notEmpty().isString().withMessage("채널 name 필요"),
      validateHandler,
    ],
    (req, res) => {
      const { id } = req.params;
      const newName = req.body?.name;
      let oldName = "";

      if (!newName) {
        res.status(400).json({ message: "올바른 입력이 아닙니다." });
        return;
      }

      const findChannelSql = "SELECT * FROM channels WHERE id = ?";

      conn.query(findChannelSql, id, (err, results) => {
        console.log("results: ", results);
        const channel = results[0] || results[0];
        if (!channel) {
          notFoundChannel(res);
          return;
        }

        oldName = channel.name;
      });

      const sql = "UPDATE channels SET name = ? WHERE id = ?";
      const values = [newName, id];

      conn.query(sql, values, (err, results) => {
        if (isResError(err, res)) return;

        if (results.affectedRows === 0) return res.status(400).end();

        res.status(201).json({
          message: `${oldName}가 ${newName}(으)로 변경되었습니다.`,
        });
      });
    }
  )
  .delete(
    [param("id").notEmpty().withMessage("채널 ID 필요"), validateHandler],
    (req, res) => {
      const { id } = req.params;

      const sql = "DELETE FROM channels WHERE id = ?";

      conn.query(sql, id, (err, results) => {
        if (isResError(err, res)) return;
        if (results.affectedRows === 0) return res.status(400).end();

        res.status(200).json(results);
      });
    }
  );

function notFoundChannel(res) {
  res.status(404).json({ message: "채널 정보를 찾을 수 없습니다." });
}

module.exports = router;
