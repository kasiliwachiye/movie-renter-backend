const { Customer, Validator } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  // new: find ALL customers
  const customers = await Customer.find().sort("name");
  // return customers to client
  res.send(customers);
});

router.get("/:id", auth, async (req, res) => {
  // 1. new: look up customer with certain id from array
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

router.post("/", auth, async (req, res) => {
  // 1. validate request object
  const result = Validator.validate(req.body);

  // 2. if request is invalid, return 400 error
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // 3. create a new customer(document)
  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  // 4. save the customer(document)
  await customer.save();

  // 5. send back added customer
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  // 1. validate request object, if request object is invalid, return 400 error
  const { error } = Validator.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // 2. find customer by ID and update
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

router.delete("/:id", auth, async (req, res) => {
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
