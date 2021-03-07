const { Movie, validate: validateMovie } = require("../models/movies");
const { Genre } = require("../models/genres");
const debug = require("debug")("app:startup");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort("title");
    res.send(movies);
  } catch (ex) {
    res.send("Problem has occured.");
  }
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findOne({ _id: req.body.genreId });
  if (!genre) return res.status(400).send("Invalid genre.");

  try {
    let movie = new Movie({
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
    });
    await movie.save();
    res.send(movie);
  } catch (ex) {
    res.send("Problem has occured.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findOneAndRemove(
      { _id: req.params.id },
      { useFindAndModify: false } // for deprication stuffs
    );
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  } catch (ex) {
    res.send("Problem has occured.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
    res.send(movie);
  } catch (ex) {
    res.send("Problem has occured.");
  }
});

module.exports = router;
