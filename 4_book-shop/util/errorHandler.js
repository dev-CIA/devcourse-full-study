const { StatusCodes } = require("http-status-codes");

const isResError = (err, res) => {
  if (err) {
    console.log("err: ", err);
    res.status(StatusCodes.BAD_REQUEST).end();
    return true;
  }
  return false;
};

module.exports = { isResError };
