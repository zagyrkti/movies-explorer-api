const moviesRouter = require('express').Router();
const { getSavedMovies, saveMovie, deleteSavedMovie } = require('../controllers/movie-controller');
const { movieSignatureValidator, idSignatureValidator } = require('../middleware/validators');

moviesRouter.get('/movies', getSavedMovies);
moviesRouter.post('/movies', movieSignatureValidator, saveMovie);
moviesRouter.delete('/movies/:movieId', idSignatureValidator, deleteSavedMovie);

module.exports = moviesRouter;
