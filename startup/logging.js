const { createLogger, transports, format, add } = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  const logger = createLogger({
    level: "error",
    format: format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
      new transports.Console({ colorize: true, prettyPrint: true }),
      new transports.File({ filename: "combined.log" }),
    ],
    exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],
    rejectionHandlers: [new transports.File({ filename: "rejections.log" })],
  });

  add(new transports.MongoDB({ db: "mongodb://localhost/movie_renter" }));

  logger.exceptions.handle(new transports.File({ filename: "exceptions.log" }));

  logger.rejections.handle(new transports.File({ filename: "rejections.log" }));
};
