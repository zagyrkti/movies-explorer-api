const usersRouter = require('express').Router();
const { getCurrentUser, updateUserData } = require('../controllers/user-controller');
const { userDataValidator } = require('../middleware/validators');

usersRouter.get('/users/me', getCurrentUser);
usersRouter.patch('/users/me', userDataValidator, updateUserData);

module.exports = usersRouter;
