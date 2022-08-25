const Joi = require("joi");
const express = require("express");
const router = express.Router();

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Horror" },
  { id: 3, name: "Romance" },
];

const genreSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send("The genre with the given ID does not exist");
  }
  res.send(genre);
});

router.post("/", (req, res) => {
  // validate request
  const result = genreSchema.validate(req.body);

  // if request is invalid, return 400
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  // update genres
  genres.push(genre);
  // send back added genre
  res.send(genre);
});

router.put("/:id", (req, res) => {
  // look up genre
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  // if not existing, return 404
  if (!genre) {
    return res.status(404).send("The genre with the given ID does not exist");
  }

  // validate request
  const { error } = genreSchema.validate(req.body);
  // if request is invalid, return 400
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // update genre
  genre.name = req.body.name;
  // return updated genre
  res.send(genre);
});

router.delete("/:id", (req, res) => {
  // look up genre
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));

  // if not existing, return 404
  if (!genre) {
    return res.status(404).send("The genre with the given ID does not exist");
  }
  // delete
  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  // return deleted genre
  res.send(genre);
});

module.exports = router;
