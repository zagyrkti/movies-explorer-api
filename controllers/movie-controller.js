const Movie = require('../models/movie-model');
const ForbiddenError = require('../errors/forbidden-error');

function getSavedMovies(req, res, next) {
  const ownerId = req.body._id;
  Movie.find({ owner: ownerId })
    .orFail()
    .then((result) => res.send(result))
    .catch(next);
}

function saveMovie(req, res, next) {
  const movie = req.body;
  const userId = req.user._id;
  const errorData = {
    400: 'Переданы некорректные данные при сохранении фильма',
  };

  Movie.create({
    movieId: movie.movieId,
    nameRU: movie.nameRU,
    nameEN: movie.nameEN,
    director: movie.director,
    country: movie.country,
    year: movie.year,
    duration: movie.duration,
    description: movie.description,
    trailerLink: movie.trailerLink,
    image: movie.image,
    thumbnail: movie.thumbnail,
    owner: userId,
  })
    .then((savedMovie) => res.send(savedMovie))
    .catch((error) => next({ error, errorData }));
}

function deleteSaveMovie(req, res, next) {
  const errorData = {
    400: 'Переданы некорректные данные _id фильма',
    404: 'Фильм с указанным _id не найдена.',
    403: 'Удалить фильм может только владелец',
  };
  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      const owner = movie.owner._id.toHexString();
      if (req.user._id === owner) {
        Movie.findByIdAndRemove(req.params.movieId)
          .orFail()
          .then((deletedMovie) => res.send(deletedMovie));
      } else {
        throw new ForbiddenError();
      }
    })
    .catch((error) => next({ error, errorData }));
}

module.exports = {
  getSavedMovies,
  saveMovie,
  deleteSaveMovie,
};
