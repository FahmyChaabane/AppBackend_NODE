const mongoose = require("mongoose");
const config = require("config");
const logger = require("../utils/logger");

module.exports = () => {
  const db_path = config.get("db");
  mongoose
    .connect(db_path, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      logger.info(`connected to ${db_path}...`);
    });
};
