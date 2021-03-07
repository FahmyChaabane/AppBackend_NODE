const { Customer, validate: validateCustomer } = require("../models/customers");
const debug = require("debug")("app:startup");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort("name");
    res.send(customers);
  } catch (ex) {
    for (index in ex.errors) {
      console.log(ex.errors[index].message);
    }
  }
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });
    await customer.save();
    res.send(customer);
  } catch (ex) {
    for (index in ex.errors) {
      console.log(ex.errors[index].message);
    }
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          isGold: req.body.isGold,
        },
      },
      {
        new: true,
        useFindAndModify: false, // for deprecation stuffs
      }
    );
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");

    res.send(customer);
  } catch (ex) {
    console.log(ex.reason);
    res.status(400).send(ex.reason);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findOneAndRemove(
      { _id: req.params.id },
      { useFindAndModify: false } // for deprication stuffs
    );
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");

    res.send(customer);
  } catch (ex) {
    for (index in ex.errors) {
      console.log(ex.errors[index].message);
    }
    res.status(404).send(ex.errors);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");
    res.send(customer);
  } catch (ex) {
    res.status(404).send("The customer with the given ID was not found.");
  }
});

module.exports = router;
