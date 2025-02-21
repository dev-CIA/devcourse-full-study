const express = require("express");
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});
app.use(express.json());

const db = new Map();

app
  .route("/channels")
  .get((req, res) => {
    res.send("전체 조회");
  }) // 채널 전체 조회
  .post((req, res) => {
    const channelTitle = req.body?.channelTitle ?? null;
    if (!channelTitle)
      res.status(400).json({ message: "요청 값을 제대로 보내주세요." });
    if (channelTitle) {
      db.set(db.size + 1, { id: db.size + 1, channelTitle });

      res.status(201).json({ message: `${channelTitle}채널을 응원합니다.` });
    }
  }); // 채널 생성

app
  .route("/channels/:id")
  .get((req, res) => {
    const id = +req.params.id;
    const channel = db.get(id);

    if (!channel)
      res.status(404).json({ message: "채널 정보를 찾을 수 없습니다." });

    if (channel) res.json(channel);
  }) // 채널 개별 조회
  .put((req, res) => {
    const id = +req.params.id;
    const channel = db.get(id);
    const newChannelTitle = req.body?.channelTitle;

    if (!channel) {
      res.status(404).json({ message: "채널 정보를 찾을 수 없습니다." });
      return;
    }
    if (!newChannelTitle) {
      res.status(400).json({ message: "올바른 입력이 아닙니다." });
      return;
    }
    if (channel) {
      const oldChannelTitle = channel.channelTitle;
      db.set(id, { ...channel, channelTitle: newChannelTitle });
      res.json({
        message: `${oldChannelTitle}가 ${newChannelTitle}(으)로 변경되었습니다.`,
      });
    }
  }) // 채널 개별 수정
  .delete((req, res) => {
    const id = +req.params.id;
    const channel = db.get(id);

    if (!channel)
      res.status(404).json({ message: "채널 정보를 찾을 수 없습니다." });

    if (channel) {
      db.delete(id);
      res.json({ message: `${channel.channelTitle}가 삭제되었습니다.` });
    }
  }); // 채널 개별 삭제
