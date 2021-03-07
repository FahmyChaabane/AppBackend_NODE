const { Rental, validate } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customers");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findOne({ _id: req.body.customerId });
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findOne({ _id: req.body.movieId });
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  // transaction
  const session = await mongoose.startSession();

  try {
    console.log("start transaction");
    session.startTransaction();

    await rental.save({ session });

    movie.numberInStock--;

    await movie.save({ session });

    await session.commitTransaction();

    res.send(rental);
  } catch (error) {
    console.log(
      "The transaction was aborted due to an unexpected error: " + error
    );
    await session.abortTransaction();
  } finally {
    console.log("end transaction");
    session.endSession();
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;
