const signXRouter = require('express').Router();
const { createUser, login } = require('../controllers/user-controller');

signXRouter.post('/signup', createUser);
signXRouter.post('/signin', login);

module.exports = signXRouter;
