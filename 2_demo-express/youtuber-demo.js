const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

let youtuber1 = {
  channelTitle: "십육이야",
  sub: "593만명",
  videoNum: "993개",
};

let youtuber2 = {
  channelTitle: "안침착맨",
  sub: "227만명",
  videoNum: "6.6천개",
};

let youtuber3 = {
  channelTitle: "테육",
  sub: "54.8만명",
  videoNum: "726천개",
};

let db = new Map();
let id = 1;
db.set(id++, youtuber1);
db.set(id++, youtuber2);
db.set(id++, youtuber3);

app.get("/youtubers", (req, res) => {
  // res.json(Object.fromEntries(db));
  if (!db.size) {
    res.json({ message: "" });
    return;
  }

  const youtubers = {};
  db.forEach((value, key) => {
    youtubers[key] = value;
  });
  res.json(youtubers);
});

app.get("/youtubers/:id", function (req, res) {
  const { id } = req.params;
  const youtuber = db.get(+id)
    ? {
        id: +id,
        ...db.get(+id),
      }
    : null;

  res.json(youtuber ?? { message: "없는 아이디입니다." });
});

app.use(express.json()); // http의 모듈인 '미들웨어': json 설정
app.post("/youtubers", (req, res) => {
  const newYoutuber = {
    ...req.body,
    sub: 0,
    videoNum: 0,
  };
  db.set(db.size + 1, newYoutuber);

  res.json({
    message: `${newYoutuber.channelTitle}님, 유튜버 생활을 응원합니다!`,
  });
});

app.delete("/youtubers/:id", (req, res) => {
  const id = +req.params.id;
  const youtuber = db.get(id) ?? null;

  if (youtuber) db.delete(id);

  res.json({
    message: youtuber
      ? `${youtuber.channelTitle}님, 아쉽지만 다음에 또 만나요.`
      : `요청하신 ${id}는 없습니다. 확인해주세요.`,
  });
});

app.delete("/youtubers", (req, res) => {
  const message = db.size
    ? "전체 유튜버가 삭제되었습니다."
    : "삭제할 유튜버가 없습니다.";

  if (db.size) db.clear();

  res.json({ message });
});

app.put("/youtubers/:id", (req, res) => {
  const id = +req.params.id;
  const youtuber = db.get(id) ?? null;
  const prevChannelTitle = youtuber.channelTitle;
  const newChannelTitle = req.body.channelTitle;

  db.set(id, { ...youtuber, channelTitle: newChannelTitle });

  res.json({
    message: youtuber
      ? `${prevChannelTitle}님, ${newChannelTitle}(으)로 수정되었습니다.`
      : "없는 유튜버입니다.",
  });
});
