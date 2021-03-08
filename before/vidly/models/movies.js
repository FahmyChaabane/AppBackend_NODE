const Joi = require("joi");
const mongoose = require("mongoose");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    numberInStock: Number,
    dailyRentalRate: Number,
    genre: new mongoose.Schema({
      name: String,
    }),
  })
);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(3).required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0).max(10),
    genreId: Joi.objectId(),
  };

  return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
