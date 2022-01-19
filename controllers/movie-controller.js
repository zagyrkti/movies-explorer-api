const Movie = require('../models/movie-model');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

function getSavedMovies(req, res, next) {
  const currentUserId = req.user._id;
  Movie.find({ owner: currentUserId })
    .orFail(new NotFoundError('У текущего пользователя отсутствуют сохраненные фильмы'))
    .then((result) => res.send(result))
    .catch(next);
}

function saveMovie(req, res, next) {
  const movie = req.body;
  const currentUserId = req.user._id;

  Movie.create({ ...movie, owner: currentUserId })
    .then((savedMovie) => res.send(savedMovie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка валидации данных'));
      }
      return next(error);
    });
}

function deleteSavedMovie(req, res, next) {
  const currentUserId = req.user._id;

  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильм по указанному id не найден'))
    .then((movie) => {
      const owner = movie.owner._id.toHexString();
      if (currentUserId === owner) {
        return Movie.findByIdAndRemove(req.params.movieId)
          .then((deletedMovie) => res.send(deletedMovie));
      }
      return next(new ForbiddenError('Удалить фильм может только владелец'));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Некорректный id'));
      }
      return next(error);
    });
}

module.exports = {
  getSavedMovies,
  saveMovie,
  deleteSavedMovie,
};
