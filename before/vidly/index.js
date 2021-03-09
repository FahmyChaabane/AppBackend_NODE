require("express-async-errors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const error = require("./middlewares/error");
const logger = require("./utils/logger");
const genres = require("./routes/genres");
const rentals = require("./routes/rentals");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const users = require("./routes/users");
const auth = require("./routes/auth");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

throw new Error("something failed");
// const p = Promise.reject(new Error("something has appeared"));
// p.then(() => console.log("a7a"));

if (!config.jwtSecretKey) {
  //process.env.jwtSecretKey
  console.log("FATAL ERROR, JWT_SECRET_KEY is not defined!");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost:27017/exercice", {
    // "playground", name of our db, if not exit, it get created for us
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to mongodb...");
  })
  .catch(() => {
    console.log("problem, couldn't connect to mongodb...");
  });

app.use(helmet());
app.use(express.json());
logger.debug("Overriding 'Express' logger");
app.use(morgan("dev", { stream: logger.stream }));
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
