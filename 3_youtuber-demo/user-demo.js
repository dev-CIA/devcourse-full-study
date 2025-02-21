// express 모듈 셋팅
const { json } = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});
app.use(express.json());

const usersDb = new Map();

function isAllExisted(obj, inputCount) {
  if (obj.constructor !== Object) return false;
  if (Object.keys(obj).length !== inputCount) return false;

  return true;
}

// 로그인
app.post("/login", (req, res) => {
  const { userId: id, password } = req.body;

  if (!isAllExisted(req.body, 2)) {
    res.status(400).json({ message: "입력하지 않은 값이 있습니다." });
    return;
  }

  if (id !== usersDb.get(id)?.userId) {
    res.status(400).json({ message: "없는 유저입니다." });
    return;
  }

  if (
    id === usersDb.get(id)?.userId &&
    password !== usersDb.get(id)?.password
  ) {
    res.status(400).json({ message: "비밀번호를 잘못 입력하셨습니다." });
    return;
  }

  const name = usersDb.get(id).name;
  res.json({ message: `${name}님 환영합니다` });
});

// 회원 가입
app.post("/join", (req, res) => {
  const user = req.body;

  if (!isAllExisted(req.body, 3)) {
    res.status(400).json({ message: "입력하지 않은 값이 있습니다." });
    return;
  }

  usersDb.set(user.userId, user);

  res.status(201).json({ message: `${user.name}님 환영합니다` });
});

app
  .route("/users/:id")
  .get((req, res) => {
    const id = req.params.id;
    const user = usersDb.get(id);

    if (!user) {
      res.status(404).json({ message: "없는 회원입니다." });
      return;
    }

    res.json({ id: user.id, name: user.name });
  })
  .delete((req, res) => {
    const id = req.params.id;
    const user = usersDb.get(id);

    if (!user) {
      res.status(404).json({ message: "없는 회원입니다." });
      return;
    }

    usersDb.delete(id);
    res.json({ message: `${user.name}님 다음에 또 뵙겠습니다` });
  });
