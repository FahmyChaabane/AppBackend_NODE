const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const genres = require("./routes/genres");
const rentals = require("./routes/rentals");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();

const url =
  "mongodb://localhost:27017,localhost:27018,localhost:27019/exercice?replicaSet=rs";
mongoose
  .connect(url, {
    // "playground", name of our db, if not exit, it get created for us
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    return MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  })
  .then((client) => {
    mongoose.connection.db
      .listCollections({ name: "rentals" })
      .next(function (err, collinfo) {
        if (!collinfo) {
          // The collection does not exists
          console.log(
            "collection rentals does not exists.. and about to be created right now... "
          );
          client.db("exercice").createCollection("rentals", {});
        }
      });
  })
  .then(() => {
    console.log("connected to mongodb...");
  })
  .catch(() => {
    console.log("problem, couldn't connect to mongodb...");
  });

app.use(helmet());
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
