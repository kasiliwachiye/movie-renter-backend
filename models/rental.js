const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: Number,
        required: true,
        minlength: 10, // find a way to get fixed number of digits
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model("Rental", rentalSchema);

const rentalValidationSchema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required()
});

exports.Rental = Rental;
exports.Validator = rentalValidationSchema;
