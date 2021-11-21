const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users');
const { creatUser, login, logout } = require('./controllers/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const errorsControll = require('./controllers/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function start() {
  try {
    await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`App listining on port: >>> ${PORT} <<<`));
  } catch (error) {
    console.log('Server ERROR: >>>', error.message);
    process.exit(1);
  }
}

start();
