const mariadb = require("mysql");

const conn = mariadb.createConnection({
  host: "localhost",
  port: process.env.DB_PORT_NUM,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

module.exports = conn;
