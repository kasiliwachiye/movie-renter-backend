require("express-async-errors");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { createLogger, transports, format, add } = require("winston");
require("winston-mongodb");

const express = require("express");
const app = express();

require('./startup/routes')();

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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is running on port ${port}`));
