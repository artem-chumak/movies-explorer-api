const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedUserError = require('../errors/UnauthorizedUserError');
const { errorPhrases } = require('../variables/messages');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    return next();
  } catch (error) {
    throw new UnauthorizedUserError(errorPhrases.NOT_AUTHORIZED);
  }
};
