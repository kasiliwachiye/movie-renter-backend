const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// define customer schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: Number,
    required: true,
    // better way to handle this
    minlength: 10,
  },
});

// create customer model
const Customer = mongoose.model("Customer", customerSchema);

// joi validator schema
const customerValidatorSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  isGold: Joi.boolean(),
  phone: Joi.number().min(10).required(),
});

router.get("/", async (req, res) => {
  // new: find ALL customers
  const customers = await Customer.find().sort("name");
  // return customers to client
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  // 1. look up customer with certain id from array
  const customer = await Customer.findById(req.params.id);

  // 2. return 404 error if it doesn't exist
  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID does not exist");
  }

  // return found object(customer) to the client
  res.send(customer);
});

router.post("/", async (req, res) => {
  // 1. validate request
  const result = customerValidatorSchema.validate(req.body);

  // 2. if request is invalid, return 400 error
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // 3. update customers
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  customer = await customer.save();

  // 4. send back added customer
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  // 1. validate request
  const { error } = customerValidatorSchema.validate(req.body);
  // 2. if request is invalid, return 400 error
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // 3. find customer by ID and update
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  );

  // 4. if customer does not exist, return 404 error
  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID does not exist");
  }

  // 5. return updated customer
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  // 1. look up customer by id and delete item
  const customer = await Customer.findByIdAndRemove(req.params.id);

  // 2. if not existing, return 404
  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID does not exist");
  }

  // 3. return deleted customer
  res.send(customer);
});

module.exports = router;
