function main() {
  console.log("main");
}
function login() {
  console.log("login");
}

let handle = {};
handle["/"] = main;
handle["/login"] = login;

exports.handle = handle;
