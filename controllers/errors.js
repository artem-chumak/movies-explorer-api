const { errorPhrases } = require('../variables/messages');

module.exports = (error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? errorPhrases.SERVER
        : message,
    });
  next();
};
