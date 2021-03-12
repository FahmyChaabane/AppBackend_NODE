const logger = require("./utils/logger");
const morgan = require("morgan");
const express = require("express");
const app = express();

app.use(morgan("dev", { stream: logger.stream }));
require("./startup/prod")(app);
require("./startup/env-variables-init")();
require("./startup/joi")();
require("./startup/database")();
require("./startup/routes")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
module.exports = server;
