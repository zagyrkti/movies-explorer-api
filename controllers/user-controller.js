const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const { JWT_SECRET } = require('../utils/config');
const errorMessages = require('../utils/error-messages');

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail(new NotFoundError(errorMessages.userWithCurrenIdNotFound))
    .then((user) => res.send(user))
    .catch((error) => next(error));
}

function updateUserData(req, res, next) {
  const userId = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError(errorMessages.userWithCurrenIdNotFound))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError(errorMessages.emailDuplication));
      }
      if (error.name === 'ValidationError') {
        return next(new BadRequestError(errorMessages.validationError));
      }
      return next(error);
    });
}

function createUser(req, res, next) {
  const { name } = req.body;
  const { email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash })
      .then((newUser) => {
        const userObject = newUser.toObject();
        delete userObject.password;
        res.send(userObject);
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          return next(new BadRequestError(errorMessages.validationError));
        }
        if (error.code === 11000) {
          return next(new ConflictError(errorMessages.emailDuplication));
        }
        return next(error);
      }))
    .catch((error) => next(error));
}

function login(req, res, next) {
  const { email, password } = req.body;

  const checkPass = (user) => bcrypt.compare(password, user.password)
    .then((matched) => {
      if (!matched) {
        throw new UnauthorizedError(errorMessages.passwordOrEmailCheckFailed);
      }
      return user;
    });

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(errorMessages.passwordOrEmailCheckFailed);
      }
      return user;
    })
    .then(checkPass)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((error) => next(error));
}

module.exports = {
  getCurrentUser,
  updateUserData,
  createUser,
  login,
};
