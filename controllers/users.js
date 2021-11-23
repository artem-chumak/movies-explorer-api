const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { errorPhrases, successPhrases } = require('../variables/messages');
const User = require('../models/user');
const UnauthorizedUserError = require('../errors/UnauthorizedUserError'); // 401
const BadRequestError = require('../errors/BadRequestError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorPhrases.NOT_FOUND_USER);
    }
    return res.status(200).send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError(errorPhrases.BAD_REQUEST));
    }
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const prospect = await User.findOne({ email });
    const userId = req.user._id;
    if (prospect && String(prospect._id) !== userId) {
      throw new ConflictError(errorPhrases.ALREADY_EXIST_USER);
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError(errorPhrases.NOT_EXIST_USER);
    }
    return res.status(200).json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(errorPhrases.BAD_REQUEST));
    }
    return next(error);
  }
};

const creatUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const prospect = await User.findOne({ email });
    if (prospect) {
      throw new ConflictError(errorPhrases.ALREADY_EXIST_USER);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    return res.status(201).json({
      name: user.name,
      email: user.email,
      _id: user._id,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(errorPhrases.BAD_REQUEST));
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedUserError(errorPhrases.WRONG_CREDENTIALS);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedUserError(errorPhrases.WRONG_CREDENTIALS);
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    return res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .json({ message: successPhrases.AUTHORIZED });
    // return res.cookie('jwt', token, {
    //   maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: 'None', secure: true,
    // }).json({ message: 'Авторизация прошла успешно' });
    //! конфигурация для сервера из старого проекта. Нужно будет ее проверить
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new UnauthorizedUserError(errorPhrases.WRONG_CREDENTIALS));
    }
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res
      .cookie('jwt', 'logout', {
        maxAge: 1,
        httpOnly: true,
        sameSite: 'None',
        sucure: true,
      })
      .json({ message: successPhrases.LOGOUT });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  creatUser,
  login,
  logout,
  updateUser,
};
