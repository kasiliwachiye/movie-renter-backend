const Joi = require("joi");
const mongoose = require("mongoose");

// 2. define customer schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: Number,
    required: true,
    minlength: 10, // find a way to get fixed number of digits
  },
});

// 3. create customer model
const Customer = mongoose.model("Customer", customerSchema);

// joi validation schema => to validate client input
const customerValidationSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  isGold: Joi.boolean(),
  phone: Joi.number().min(10).required(),
});

exports.Customer = Customer;
exports.Validator = customerValidationSchema;
