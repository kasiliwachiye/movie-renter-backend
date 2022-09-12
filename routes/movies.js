const { Movie, Validator } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require('../middleware/auth')
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // 1. find ALL movies
  const movies = await Movie.find().sort("title");
  // 2. return movies to client
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  // 1. find movie by a id
  const movie = await Movie.findById(req.params.id);

  // 2. return 404 error if it doesn't exist
  if (!movie) {
    return res.status(404).send("The movie with the given ID does not exist");
  }

  // 3. return found object(movie) to the client
  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  // 1. validate request object, if request object is invalid, return 400 error
  const result = Validator.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  // 2. find genre by ID, send error message if invalid
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  // 3. create a new movie (document)
  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  // 4. save the added movie document
  await movie.save();

  // 5. send back added movie
  res.send(movie);
});

router.put("/:id", auth, async (req, res) => {
  // 1. validate request, if request is invalid, return 400 error
  const { error } = Validator.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // 2. find genre by ID, send error message if invalid
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  // 2. find movie  by ID and update
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  // if not existing, return 404
  if (!movie) {
    return res.status(404).send("The movie with the given ID does not exist");
  }

  // 3. return updated movie
  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  // find movie by id and remove it
  const movie = await Movie.findByIdAndRemove(req.params.id);

  // 2. if not existing, return 404
  if (!movie) {
    return res.status(404).send("The movie with the given ID does not exist");
  }

  // return deleted movie
  res.send(movie);
});

module.exports = router;
