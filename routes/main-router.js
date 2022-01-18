const mainRouter = require('express').Router();
const moviesRouter = require('./movies-router');
const usersRouter = require('./users-router');
const signXRouter = require('./sing-x-router');

mainRouter.use(moviesRouter);
mainRouter.use(usersRouter);
mainRouter.use(signXRouter);

module.exports = mainRouter;
