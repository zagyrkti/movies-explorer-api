const mainRouter = require('express').Router();
const moviesRouter = require('./movies-router');
const usersRouter = require('./users-router');
const signXRouter = require('./sing-x-router');
const auth = require('../middleware/auth');
const NotFoundError = require('../errors/not-found-error');

mainRouter.use(signXRouter);
mainRouter.use(auth);
mainRouter.use(moviesRouter);
mainRouter.use(usersRouter);

mainRouter.all('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

module.exports = mainRouter;
