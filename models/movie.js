const { Types, Schema, model } = require('mongoose');
const validator = require('validator');
const { errorPhrases } = require("../variables/messages");

const movieSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) =>
        validator.isURL(link, {
          protocols: ["http", "https"],
          require_protocol: true,
        }),
      message: errorPhrases.NOT_CORRECT_LINK,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (link) =>
        validator.isURL(link, {
          protocols: ["http", "https"],
          require_protocol: true,
        }),
      message: errorPhrases.NOT_CORRECT_LINK,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) =>
        validator.isURL(link, {
          protocols: ["http", "https"],
          require_protocol: true,
        }),
      message: errorPhrases.NOT_CORRECT_LINK,
    },
  },
  owner: {
    type: Types.ObjectId,
    ref: "user",
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = model('movie', movieSchema);
