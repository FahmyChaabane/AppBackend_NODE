const winston = require("winston");
const logger = require("./utils/logger");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const app = express();

app.use(helmet());
app.use(morgan("dev", { stream: logger.stream }));
require("./startup/env-variables-init")();
require("./startup/joi")();
require("./startup/database")();
require("./startup/routes")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
