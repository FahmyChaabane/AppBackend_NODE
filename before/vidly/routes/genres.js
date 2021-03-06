const { Genre, validate: validateGenre } = require("../models/genres");
const debug = require("debug")("app:startup");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (ex) {
    for (index in ex.errors) {
      console.log(ex.errors[index].message);
    }
  }
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let genre = new Genre({
      name: req.body.name,
    });
    genre = await genre.save();
    res.send(genre);
  } catch (ex) {
    for (index in ex.errors) {
      console.log(ex.errors[index].message);
    }
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const genre = await Genre.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
        },
      },
      {
        new: true,
        useFindAndModify: false, // for deprecation stuffs
      }
    );
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  } catch (ex) {
    console.log(ex.reason);
    res.status(400).send(ex.reason);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findOneAndRemove(
      { _id: req.params.id },
      { useFindAndModify: false } // for deprication stuffs
    );
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  } catch (ex) {
    for (index in ex.errors) {
      console.log(ex.errors[index].message);
    }
    res.status(404).send(ex.errors);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  } catch (ex) {
    res.status(404).send("The genre with the given ID was not found.");
  }
});

module.exports = router;
