const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'secret-key';

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с текущим id не найден'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Некорректный id'));
      }
      return next(error);
    });
}

function updateUserData(req, res, next) {
  const userId = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с текущим id не найден'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError('Пользователь с указанным email уже зарегистрирован'));
      }
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка валидации данных'));
      }
      if (error.name === 'CastError') {
        return next(new BadRequestError('Некорректный id'));
      }
      return next(error);
    });
}

function createUser(req, res, next) {
  const { name } = req.body;
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError('Пользователь с указанным email уже зарегистрирован'));
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({ name, email, password: hash })
          .then((newUser) => {
            const userObject = newUser.toObject();
            delete userObject.password;
            res.send(userObject);
          })
          .catch((error) => {
            if (error.name === 'ValidationError') {
              return next(new BadRequestError('Ошибка валидации данных'));
            }
            return next(error);
          }));
      return next;
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  const checkPass = (user) => bcrypt.compare(password, user.password)
    .then((matched) => {
      if (!matched) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return user;
    });

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return user;
    })
    .then(checkPass)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка валидации данных'));
      }
      return next(error);
    });
}

module.exports = {
  getCurrentUser,
  updateUserData,
  createUser,
  login,
};
