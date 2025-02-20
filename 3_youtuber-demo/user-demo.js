// express 모듈 셋팅
const { json } = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});

const usersDb = new Map();

app.use(express.json());

// 로그인
app.post("/login", (req, res) => {
  const user = req.body;

  if (!user || !user.id || !user.password) {
    res.status(400).json({ message: "잘못 입력하셨습니다." });
    return;
  }

  const name = usersDb.get(user.id).name;
  res.json({ message: `${name}님 환영합니다` });
});

// 회원 가입
app.post("/join", (req, res) => {
  const user = req.body;

  if (!user || !user.id || !user.password || !user.name) {
    res.status(400).json({ message: "잘못 입력하셨습니다." });
    return;
  }

  usersDb.set(user.id, user);
  res.status(201).json({ message: `${user.name}님 환영합니다` });
});

// 회원 개별 조회
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = usersDb.get(id);

  if (!user) {
    res.status(404).json({ message: "없는 회원입니다." });
    return;
  }

  res.json({ id: user.id, name: user.name });
});

// 회원 개별 탈퇴
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = usersDb.get(id);

  if (!user) {
    res.status(404).json({ message: "없는 회원입니다." });
    return;
  }

  usersDb.delete(id);
  res.json({ message: `${user.name}님 다음에 또 뵙겠습니다` });
});
