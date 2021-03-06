const genres = require("./routes/genres");
const customers = require("./routes/customers");
const helmet = require("helmet");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/exercice", {
    // "playground", name of our db, if not exit, it get created for us
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
