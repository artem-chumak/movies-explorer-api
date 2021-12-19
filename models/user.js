const { Schema, model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Неправильный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = model('user', userSchema);
