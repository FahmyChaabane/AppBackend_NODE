const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isGold: { type: Boolean, required: true },
  phone: { type: String, required: true },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(3).required(),
    isGold: Joi.boolean(),
    phone: Joi.string(),
  };

  return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
