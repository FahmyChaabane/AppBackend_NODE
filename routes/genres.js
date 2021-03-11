const { Genre, validate: validateGenre } = require("../models/genres");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });
  await genre.save();
  res.send(genre);
});

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
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
  })
);

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findOneAndRemove(
    { _id: req.params.id },
    { useFindAndModify: false } // for deprication stuffs
  );
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});
/*
router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  })
);*/

module.exports = router;
