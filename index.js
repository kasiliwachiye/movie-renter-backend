const bodyParser = require("body-parser");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/config")();
require("./startup/db")();
require("./startup/prod")(app);

const error = require("./middleware/error");

const customers = require("./routes/customers");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", auth);
app.use("/api/customers", customers);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is running on port ${port}`));
