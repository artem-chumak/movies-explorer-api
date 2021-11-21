const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const ForbiddenAccessError = require('../errors/ForbiddenAccessError'); // 403

const getMovies = async (req, res, next) => {
  try {
    const userId = await req.user._id;
    const movies = await Movie.find({ owner: userId });
    res.status(200).json(movies);
  } catch (error) { next(error); }
};

const addMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const owner = req.user._id;
    const movie = new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });
    await movie.save();
    return res.status(201).json(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } return next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      throw new NotFoundError('Кино с таким номером нет');
    }
    if (movie.owner.toStryng() !== userId) {
      throw new ForbiddenAccessError('Можно удалять только свои фильмы');
    }
    await Movie.remove(movie);
    return res.status(200).json(movie);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } return next(error);
  }
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
