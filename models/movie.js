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
    max: 99,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
});

// 3. create movie model and collection
const Movie = mongoose.model("Movies", movieSchema);

// joi validation schema => to validate client input 
const movieValidationSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  genreId: Joi.objectId().required(),
  numberInStock: Joi.number().min(0).required(),
  dailyRentalRate: Joi.number().min(0).required(),
});

exports.Movie = Movie;
exports.Validator = movieValidationSchema;
