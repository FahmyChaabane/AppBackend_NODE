const mongoose = require("mongoose");
const winston = require("winston");

module.exports = () => {
  mongoose
    .connect("mongodb://localhost:27017/exercice", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      winston.info("connected to mongodb...");
    });
};
