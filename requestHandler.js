const fs = require("fs");
const main_view = fs.readFileSync("./main.html", "utf-8");
const orderList_view = fs.readFileSync("./order-list.html", "utf-8");
const mariadb = require("./database/connect/mariadb");

function responseHandler(res, data, contentType = "text/html") {
  res.writeHead(200, { "Content-Type": contentType });
  res.write(data);
  res.end();
}

function main(res) {
  console.log("main");

  mariadb.query("SELECT * FROM product", function (err, rows) {
    console.log(rows);
  });

  responseHandler(res, main_view);
}

function login(res) {
  console.log("login");

  responseHandler(res, "Login page");
}

function css(res) {
  fs.readFile(`.${res.req.url}`, function (err, data) {
    responseHandler(res, data, "text/css");
  });
}

function redRacket(res) {
  fs.readFile("./img/redRacket.png", function (err, data) {
    responseHandler(res, data, "image/png");
  });
}
function blueRacket(res) {
  fs.readFile("./img/blueRacket.png", function (err, data) {
    responseHandler(res, data, "image/png");
  });
}
function blackRacket(res) {
  fs.readFile("./img/blackRacket.png", function (err, data) {
    responseHandler(res, data, "image/png");
  });
}

function order(res, productId) {
  res.writeHead(200, { "Content-Type": "text/html" });

  mariadb.query(
    "INSERT INTO orderlist VALUES (" +
      productId +
      ", '" +
      new Date().toLocaleDateString() +
      "');"
  );

  res.write("order");
  res.end();
}

function orderList(res) {
  console.log("order-list");
  res.writeHead(200, { "Content-Type": "text/html" });

  mariadb.query("SELECT * FROM orderlist", function (err, rows) {
    res.write(orderList_view);

    rows.forEach((row) => {
      res.write(
        "<tr>" +
          "<td>" +
          row.id +
          "</td>" +
          "<td>" +
          row.order_date +
          "</td>" +
          "</tr>"
      );
    });
    res.write("</table>");

    res.end();
  });
}

let handle = {};
handle["/"] = main;
handle["/login"] = login;
handle["/order"] = order;
handle["/order-list"] = orderList;

handle["/main.css"] = css;
handle["/order-list.css"] = css;

/* img directory */
handle["/img/redRacket.png"] = redRacket;
handle["/img/blueRacket.png"] = blueRacket;
handle["/img/blackRacket.png"] = blackRacket;

exports.handle = handle;
