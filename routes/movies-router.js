const moviesRouter = require('express').Router();
const { getSavedMovies, saveMovie, deleteSaveMovie } = require('../controllers/movie-controller');

moviesRouter.get('/movies', getSavedMovies);
moviesRouter.post('/movies', saveMovie);
moviesRouter.delete('/movies/:movieId', deleteSaveMovie);

module.exports = moviesRouter;
