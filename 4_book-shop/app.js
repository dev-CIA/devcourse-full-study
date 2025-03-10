const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});

const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const cartsRouter = require("./routes/carts");
const ordersRouter = require("./routes/orders");
const likesRouter = require("./routes/likes");

app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);
app.use("/likes", likesRouter);
