const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxLength: 1024, // cuz gonna be hashed
  },
  isAdmin: Boolean,
});

userSchema.methods.generateJWT = async function () {
  return await jwt.sign(
    { id: this._id, name: this.name, isAdmin: this.isAdmin },
    config.get("jwtSecretKey")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(255).required(), // right here pwd gonna be plain text, gonna be hashed
    isAdmin: Joi.boolean(),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
