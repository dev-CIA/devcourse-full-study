const { body, param, validationResult } = require("express-validator");

const validateHandler = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) return next();
  return res.status(400).json(err.array());
};

const isResError = (err, res) => {
  if (err) {
    console.log("err: ", err);
    res.status(400).end();
    return true;
  }
  return false;
};

module.exports = { body, param, validateHandler, isResError };
