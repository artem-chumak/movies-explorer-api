const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { errorPhrases } = require('../variables/messages');

router.use('*', () => {
  throw new NotFoundError(errorPhrases.NOT_FOUND_ADRESS);
});

module.exports = router;
