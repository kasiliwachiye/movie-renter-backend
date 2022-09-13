require("express-async-errors");
const bodyParser = require("body-parser");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { createLogger, transports, format, add } = require("winston");
require("winston-mongodb");
const error = require("./middleware/error");

const express = require("express");
const app = express();

const customers = require("./routes/customers");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

const logger = createLogger({
  level: "error",
  format: format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" }),
  ],
  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "rejections.log" })],
});

add(new transports.MongoDB({db: 'mongodb://localhost/movie_renter'}));

logger.exceptions.handle(new transports.File({ filename: "exceptions.log" }));

logger.rejections.handle(new transports.File({ filename: "rejections.log" }));

if (!config.get("jwtPrivateKey")) {
  console.log(`FATAL ERROR: jwtPrivateKey is not defined`);
  process.exit(1);
}

// 1. connect to mongodb
mongoose
  .connect("mongodb://localhost/movie_renter")
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.error(err));

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
