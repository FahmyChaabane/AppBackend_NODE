const Joi = require("joi");
const express = require("express");
const route = express.Router();

const courses = [
  { id: 1, name: "course 1" },
  { id: 2, name: "course 2" },
  { id: 3, name: "course 3" },
  { id: 4, name: "course 4" },
];

route.get("/", (req, res) => {
  res.send(courses);
});

route.get("/:id", (req, res) => {
  const course = courses.find((item) => item.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("course was not found");
    return;
  }
  res.send(course);
});

route.put("/:id", (req, res) => {
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

route.post("/", (req, res) => {
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

route.delete("/:id", (req, res) => {
  const course = courses.find((item) => item.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("course was not found");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

const validateCourse = (body) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(body, schema);
};

module.exports = route;
