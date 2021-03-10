const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  //Logging the error
  logger.error(err.message);
  res.status(500).send("Something had failed.");
  next(err);
};
