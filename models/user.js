const Joi = require("joi");
const mongoose = require("mongoose");

// define schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 50
  },
  email: {
    type: String,
    unique: true,
    max: 50
  },
  password: {
    type: String,
    min: 6,
    max: 1024
  },
});

// create a a model & collection
const User = mongoose.model("User", userSchema);

// validation schema
const userValidationSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).alphanum().required(),
});

exports.User = User;
exports.Validator = userValidationSchema;
