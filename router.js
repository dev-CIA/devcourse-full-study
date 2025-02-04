function route(pathName, handle) {
  console.log("pathName: ", pathName);

  if (pathName !== "/" || pathName !== "/login") {
    console.log("경로를 확인하세요");
    return;
  }
  handle[pathName]();
}

exports.route = route;
