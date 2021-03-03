const debug = require("debug")("app:startup");
const config = require("config");
const helmet = require("helmet");
const path = require("path");
const rfs = require("rotating-file-stream");
const morgan = require("morgan");
const logger = require("./middlewares/logger");
const courses = require("./routes/courses");
const home = require("./routes/home");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(helmet());
app.use("/api/courses", courses);
app.use("/", home);

console.log("app name", config.get("name"));
console.log("server name", config.get("mail.server"));
console.log("server password", config.get("mail.password"));

if (app.get("env") === "development") {
  debug("Morgan enabled... ");
  // create a rotating write stream
  var accessLogStream = rfs.createStream("file.log", {
    interval: "1d", // rotate daily
    path: path.join(__dirname, "log"),
  });
  // setup the logger
  app.use(morgan("tiny", { stream: accessLogStream }));
}

app.use(logger);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
