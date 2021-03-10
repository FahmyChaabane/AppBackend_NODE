const Joi = require("joi");
const { User } = require("../models/users");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

const validate = (login) => {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(255).required(), // right here pwd gonna be plain text, gonna be hashed
  };

  return Joi.validate(login, schema);
};

router.post("/", async (req, res) => {
  // loggining
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or Password invalid.");

  const validPwd = await bcrypt.compare(req.body.password, user.password);
  if (!validPwd) return res.status(400).send("Email or Password invalid.");

  const token = await user.generateJWT();
  console.log("jwt token genrated: ", token);

  res.send(token);
});

module.exports = router;
