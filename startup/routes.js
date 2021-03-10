require("express-async-errors");
const genres = require("../routes/genres");
const rentals = require("../routes/rentals");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const users = require("../routes/users");
const auth = require("../routes/auth");
const home = require("../routes/home");
const error = require("../middlewares/error");
const express = require("express");

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/", home);
  app.use(error); // TROP IMPORTANT bech !! bech express-async-errors yredirectilou wakta mafamma exception
};
