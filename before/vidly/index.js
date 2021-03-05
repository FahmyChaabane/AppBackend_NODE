const genres = require("./routes/genres");
const helmet = require("helmet");
const express = require("express");
const app = express();

app.use(helmet());
app.use(express.json());
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
