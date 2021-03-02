const logger = require("./logger");
const Joi = require("joi");
const helmet = require("helmet");
var path = require("path");
var rfs = require("rotating-file-stream");
const morgan = require("morgan");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(helmet());

if (app.get("env") === "development") {
  console.log("Morgan enabled... ");
  // create a rotating write stream
  var accessLogStream = rfs.createStream("file.log", {
    interval: "1d", // rotate daily
    path: path.join(__dirname, "log"),
  });
  // setup the logger
  app.use(morgan("tiny", { stream: accessLogStream }));
}

app.use(logger);

const courses = [
  { id: 1, name: "course 1" },
  { id: 2, name: "course 2" },
  { id: 3, name: "course 3" },
  { id: 4, name: "course 4" },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((item) => item.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("course was not found");
    return;
  }
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((item) => item.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("course was not found");
    return;
  }

  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  course.name = req.body.name;
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((item) => item.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("course was not found");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

const validateCourse = (body) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(body, schema);
};
