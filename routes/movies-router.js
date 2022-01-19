const moviesRouter = require('express').Router();
const { getSavedMovies, saveMovie, deleteSavedMovie } = require('../controllers/movie-controller');

moviesRouter.get('/movies', getSavedMovies);
moviesRouter.post('/movies', saveMovie);
moviesRouter.delete('/movies/:movieId', deleteSavedMovie);

module.exports = moviesRouter;
