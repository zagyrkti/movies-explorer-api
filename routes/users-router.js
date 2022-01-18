const usersRouter = require('express').Router();
const { getCurrentUser, updateUserData } = require('../controllers/user-controller');

usersRouter.get('/users/me', getCurrentUser);
usersRouter.patch('/users/me', updateUserData);

module.exports = usersRouter;
