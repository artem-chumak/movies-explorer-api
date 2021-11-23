// todo 1. Разлочить корс, когда будет деплой с фронтом
// todo 2. Разобраться с токено при логировании, когда будет деплой фронта
// todo 3. Когда делаешь запрос на изменение почты, то нужно сделать проверку на наличие такой почты
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const { errors, celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const limiter = require('./limiter/limiter');
const authen = require('./routes/authen');
const usersRouter = require('./routes/users');
// const { creatUser, login, logout } = require('./controllers/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const wrong = require('./routes/wrong');
const errorsControll = require('./controllers/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const NotFoundError = require('./errors/NotFoundError');
// const { errorPhrases } = require('./variables/messages');

const { PORT = 3000 } = process.env;

// const allowedCors = [
//   'http://artchumak.nomoredomains.rocks',
//   'https://artchumak.nomoredomains.rocks',
//   'localhost:3000',
// ];

const app = express();
app.use(requestLogger);

// app.use((req, res, next) => {
//   const { origin } = req.headers;
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Credentials', true);
//   }
//   const { method } = req;
//   if (method === 'OPTIONS') {
//     const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//     const requestHeaders = req.headers['access-control-request-headers'];
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }
//   return next();
// });

app.use(helmet());
app.use(limiter);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// app.post(
//   '/signin',
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().email(),
//       password: Joi.string().required().min(8),
//     }),
//   }),
//   login,
// );

// app.post(
//   '/signup',
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().email(),
//       password: Joi.string().required().min(8),
//       name: Joi.string().min(2).max(30),
//     }),
//   }),
//   creatUser,
// );

// app.get('/logout', logout);

app.use(authen);
app.use(auth, usersRouter);
app.use(auth, moviesRouter);

// app.use('*', () => {
//   throw new NotFoundError(errorPhrases.NOT_FOUND_ADRESS);
// });

app.use(wrong);

app.use(errorLogger);

app.use(errors());

app.use(errorsControll);

async function start() {
  try {
    await mongoose.connect('mongodb://localhost:27017/moviesdb', {
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
