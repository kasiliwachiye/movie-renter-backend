const { Genre, Validator } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // new: find ALL genres
  const genres = await Genre.find().sort("name");
  // return genres to client
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  // 1. look up genre with certain id from array
  // const genre = genres.find((genre) => genre.id === parseInt(req.params.id));

  // new: find genre by a certain id
  const genre = await Genre.findById(req.params.id);

  // 2. return 404 error if it doesn't exist
  if (!genre) {
    return res.status(404).send("The genre with the given ID does not exist");
  }

  // return found object(genre) to the client
  res.send(genre);
});

router.post("/", async (req, res) => {
  // 1. validate request object, if request object is invalid, return 400 error
  const result = Validator.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  // 2. update genres | new: create a document
  // const genre = {
  //   id: genres.length + 1,
  //   name: req.body.name,
  // };
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  // 4. send back added genre
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  // 3. validate request object, if request object is invalid, return 400 error
  const { error } = Validator.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  // 1. look up genre
  // const genre = genres.find((genre) => genre.id === parseInt(req.params.id));

  // 2. if not existing, return 404
  if (!genre) {
    return res.status(404).send("The genre with the given ID does not exist");
  }

  // 4. update genre
  // genre.name = req.body.name;

  // 5. return updated genre
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  // 1. look up genre
  // const genre = genres.find((genre) => genre.id === parseInt(req.params.id));

  // 2. if not existing, return 404
  if (!genre) {
    return res.status(404).send("The genre with the given ID does not exist");
  }
  // 3. delete
  // const index = genres.indexOf(genre);
  // genres.splice(index, 1);

  // return deleted genre
  res.send(genre);
});

module.exports = router;
