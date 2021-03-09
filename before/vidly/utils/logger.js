const winston = require("winston");

var logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "./logs/app.log",
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: "error",
      //handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "./logs/uncaughtExceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "./logs/unhandledRejections.log" }),
  ],
  exitOnError: false,
});

module.exports = logger;
module.exports.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};