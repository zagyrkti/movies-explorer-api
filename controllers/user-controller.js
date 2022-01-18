const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const DuplicateError = require('../errors/duplicate-error');
const UnauthorizedError = require('../errors/unauthorized-error');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'secret-key';

function getCurrentUser(req, res, next) {
  const errorData = {
    400: 'Переданы некорректные данные id',
    404: 'Пользователь по указанному _id не найден',
  };

  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => next({ error, errorData }));
}

function updateUserData(req, res, next) {
  const userId = req.user._id;
  const { name, email } = req.body;
  const errorData = {
    400: 'Переданы некорректные данные при обновлении профиля',
    404: 'Пользователь с указанным _id не найден',
  };

  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => next({ error, errorData }));
}

function createUser(req, res, next) {
  const { name } = req.body;
  const { email, password } = req.body;
  const errorData = {
    400: 'Переданы некорректные данные при создании пользователя',
    409: 'Пользователь с таким email уже зарегистрирован',
  };

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new DuplicateError();
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({ name, email, password: hash })
          .then((newUser) => {
            const userObject = newUser.toObject();
            delete userObject.password;
            res.send(userObject);
          })
          .catch((error) => next({ error, errorData })));
    })
    .catch((error) => next({ error, errorData }));
}

function login(req, res, next) {
  const { email, password } = req.body;
  const errorData = {
    401: 'Неправильные почта или пароль',
  };

  const checkPass = (user) => bcrypt.compare(password, user.password)
    .then((matched) => {
      if (!matched) {
        throw new UnauthorizedError();
      }
      return user;
    });

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError();
      }
      return user;
    })
    .then(checkPass)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((error) => next({ error, errorData }));
}

module.exports = {
  getCurrentUser,
  updateUserData,
  createUser,
  login,
};
