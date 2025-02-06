function route(pathName, handle, res, productId) {
  console.log("pathName: ", pathName);

  if (typeof handle[pathName] == "function") {
    handle[pathName](res, productId);
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.write("Not found");
    res.end();
  }
}

exports.route = route;
