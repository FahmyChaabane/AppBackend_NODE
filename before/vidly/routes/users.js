const _ = require("lodash");
const { User, validate } = require("../models/users");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.password, salt);
  //user = new User(_.pick(req.body, ["name", "email", "password"]));
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPwd,
    isAdmin: req.body.isAdmin,
  });
  await user.save();

  const token = await user.generateJWT();
  //const token = await user.generateJWT2(user);
  res.header("x-auth", token).send(_.pick(user, ["name", "email"]));
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(user);
});

module.exports = router;
