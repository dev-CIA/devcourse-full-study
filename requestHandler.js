function responseHandler(res, message) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(message);
  res.end();
}

function main(res) {
  console.log("main");

  responseHandler(res, "Main page");
}

function login(res) {
  console.log("login");

  responseHandler(res, "Login page");
}

function my(res) {
  console.log("login");

  responseHandler(res, "CHOI IN AE page");
}

let handle = {};
handle["/"] = main;
handle["/login"] = login;
handle["/my"] = my;

exports.handle = handle;
