const signXRouter = require('express').Router();
const { createUser, login } = require('../controllers/user-controller');
const { signUpValidator, loginValidator } = require('../middleware/validators');

signXRouter.post('/signup', signUpValidator, createUser);
signXRouter.post('/signin', loginValidator, login);

module.exports = signXRouter;
