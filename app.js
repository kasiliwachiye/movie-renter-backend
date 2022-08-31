const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require('./routes/movies');
const express = require("express");
const app = express();

// 1. connect to mongodb
mongoose
  .connect("mongodb://localhost/movie_renter")
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.error(err));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is running on port ${port}`));
