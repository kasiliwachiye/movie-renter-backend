const { error} = require('winston');

module.exports = (err, req, res, next) => {
  error(err.message,err)
  res.status(500).send("Something went wrong");
}