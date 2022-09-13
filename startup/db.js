const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect("mongodb://localhost/movie_renter")
    .then(() => console.log(`Connected to MongoDB...`));
}