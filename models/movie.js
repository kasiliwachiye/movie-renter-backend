const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

// 2. define movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 999,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 999,
  },
});

// 3. create movie model
const Movie = mongoose.model("Movies", movieSchema);

// joi validator schema
const movieValidatorSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  genreId: Joi.string().required(),
  numberInStock: Joi.number().min(1).required(),
  dailyRentalRate: Joi.number().min(1).required(),
});

exports.Movie = Movie;
exports.Validator = movieValidatorSchema;
