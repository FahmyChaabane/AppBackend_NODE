const config = require("config");
const logger = require("../utils/logger");

module.exports = () => {
  if (!config.jwtSecretKey) {
    logger.error("FATAL ERROR, JWT_SECRET_KEY is not defined!");
    //throw new Error("FATAL ERROR, JWT_SECRET_KEY is not defined!")
    process.exit(1);
  }
};
