const express = require("express");
const conn = require("../mariadb");

const router = express.Router();
router.use(express.json());

router
  .route("/")
  // 채널 전체 조회
  .get((req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
      res.status(404).json({ message: "로그인이 필요합니다." }).end();
      return;
    }

    const sql = "SELECT * FROM `channels` WHERE user_id = ?";

    conn.query(sql, user_id, (err, results) => {
      const channels = results ?? results;

      if (channels.length === 0) notFoundChannel(res);
      if (channels.length) res.json(channels);
    });
  })
  // 채널 생성
  .post((req, res) => {
    const { name, user_id } = req.body;

    const sql = "INSERT INTO channels (name,  user_id) VALUES (?, ?)";
    const values = [name, user_id];

    if (!name || !user_id) {
      res.status(400).json({ message: "요청 값을 제대로 보내주세요." });
      return;
    }

    conn.query(sql, values, (err, results) => {
      res.status(201).json({ message: `${name} 채널을 응원합니다.` });
    });
  });

router
  .route("/:id")
  .get((req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM `channels` WHERE id = ?";

    conn.query(sql, id, (err, results) => {
      if (results.length) res.status(200).json(results);
      if (!results.length) notFoundChannel(res);
    });
  })
  .put((req, res) => {
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
      console.log("results: ", results);

      res.status(201).json({
        message: `${oldName}가 ${newName}(으)로 변경되었습니다.`,
      });
    });
  })
  .delete((req, res) => {
    const id = +req.params.id;
    const channel = db.get(id);

    if (!channel) notFoundChannel();

    if (channel) {
      db.delete(id);
      res.json({ message: `${channel.channelTitle}가 삭제되었습니다.` });
    }
  });

function notFoundChannel(res) {
  res.status(404).json({ message: "채널 정보를 찾을 수 없습니다." });
}

module.exports = router;
