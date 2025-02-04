// require: nodejs가 가지고 있는 모듈을 가져오는 함수
// http라는 모듈을 node에서 제공함
let http = require("http");
let url = require("url"); // nodejs에서 제공하는 url이라는 모듈

function start(route, handle) {
  function onRequest(req, res) {
    let pathName = url.parse(req.url).pathname; // 포트넘버 뒤에 오는 경로
    route(pathName, handle, res);
  }
  /**
   * createServer: 서버를 만드는 함수 제공
   * params: 실행할 함수
   * listen: 서버는 들을 수 있음, 듣고 싶은 주파수를 인수로 넣으면 됨
   */
  http.createServer(onRequest).listen(8888);
  // 서버 구동은 node {파일명.확장자} -> 이 경우 node server.js
}

exports.start = start;
