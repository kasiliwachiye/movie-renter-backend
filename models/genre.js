const Joi = require("joi");
const mongoose = require("mongoose");

// 2. define genre schema
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
});

// 3. create genre model
const Genre = mongoose.model("Genre", genreSchema);

// joi validator schema
const genreValidatorSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

module.exports.Genre = Genre;
module.exports.Validator = genreValidatorSchema;
