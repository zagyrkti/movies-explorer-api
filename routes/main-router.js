const mainRouter = require('express').Router();
const moviesRouter = require('./movies-router');
const usersRouter = require('./users-router');
const signXRouter = require('./sing-x-router');
const auth = require('../middleware/auth');
const NotFoundError = require('../errors/not-found-error');
const errorMessages = require('../utils/error-messages');

mainRouter.use(signXRouter);
mainRouter.use(auth);
mainRouter.use(moviesRouter);
mainRouter.use(usersRouter);

mainRouter.all('*', () => {
  throw new NotFoundError(errorMessages.resourceNotFound);
});

module.exports = mainRouter;
