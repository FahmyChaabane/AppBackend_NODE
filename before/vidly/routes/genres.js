const debug = require("debug")("app:startup");
const Joi = require("joi");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

mongoose
  .connect("mongodb://localhost:27017/exercice", {
    // "playground", name of our db, if not exit, it get created for us
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb...");
  })
  .catch(() => {
    console.log("problem, couldn't connect to mongodb...");
  });

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Genre = mongoose.model("Genre", genreSchema);

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
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
    const genre = new Genre({
      name: req.body.name,
    });
    const result = await genre.save();
    res.send(result);
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

    res.send(genre);
  } catch (ex) {
    for (index in ex.errors) {
      console.log(ex.errors[index].message);
    }
    res.status(404).send("The genre with the given ID was not found.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findOneAndRemove(
      { _id: req.params.id },
      { useFindAndModify: false } // for deprication stuffs
    );
    debug(genre);
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
    const genres = await Genre.findById(req.params.id);
    res.send(genres);
  } catch (ex) {
    res.status(404).send("The genre with the given ID was not found.");
  }
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

module.exports = router;
