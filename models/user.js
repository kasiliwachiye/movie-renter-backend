const Joi = require("joi");
const mongoose = require("mongoose");

// define schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
});

// create a a model & collection
const User = mongoose.model("User", userSchema);

// validation schema
const userValidationSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().min(5).max(255).email().required(),
  password: Joi.string().min(5).max(255).alphanum().required(),
});

exports.User = User;
exports.Validator = userValidationSchema;
