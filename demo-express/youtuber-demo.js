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
  res.json(Object.fromEntries(db));
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
  console.log(req.body);
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
