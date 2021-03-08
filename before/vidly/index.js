const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const colors = require("colors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const rentals = require("./routes/rentals");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const app = express();

if (!config.get("jwtSecretKey")) {
  console.log("FATAL ERROR, JWT_SECRET_KEY is not defined!".red);
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
    console.log("connected to mongodb...".green);
  })
  .catch(() => {
    console.log("problem, couldn't connect to mongodb...".red);
  });

app.use(helmet());
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`.blue));
