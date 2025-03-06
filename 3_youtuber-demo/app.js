const express = require("express");
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});

const userRouter = require("./routes/users");
const channelRouter = require("./routes/channels");

app.use("/", userRouter);
app.use("/channels", channelRouter);
