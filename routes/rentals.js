const { Rental, Validator } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");

const Fawn = require("fawn");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

Fawn.init("mongodb://localhost/movie_renter");

router.get("/", auth, async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", auth, async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    return res.status(404).send("The rental with the given ID does not exist");
  }

  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  const { error } = Validator.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  if (movie.numberInStock === 0) {
    return res.status(400).send("Movie not in stock");
  }

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

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
  } catch (error) {
    res.status(500).send("Something went wrong");
  }

  res.send(rental);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = Validator.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {},
    { new: true }
  );
  if (!rental) {
    return res.status(404).send("The rental with the given ID does not exist");
  }
  res.send(rental);
});

router.delete("/:id", auth, async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);

  if (!rental) {
    return res.status(404).send("The rental with the given ID does not exist");
  }

  res.send(rental);
});

module.exports = router;
