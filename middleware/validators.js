const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');
const emailPattern = require('../utils/constants');

const url = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Требуется валидный url');
};

/* const passwordPattern = /^[-a-zA-Z0-9()!-$^*@:%_+.~#?&/=]{3,20}$/; */

const movieSignatureValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    director: Joi.string().required(),
    country: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    description: Joi.string().required(),
    trailer: Joi.string().required().custom(url),
    image: Joi.string().required().custom(url),
    thumbnail: Joi.string().required().custom(url),
  }),
});

const loginValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().pattern(emailPattern),
    password: Joi.string().required().min(6).max(20),
  }),
});

const idSignatureValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

const userDataValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(emailPattern),
  }),
});

const signUpValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(emailPattern),
    password: Joi.string().required().min(6).max(20),
  }),
});

module.exports = {
  movieSignatureValidator,
  loginValidator,
  idSignatureValidator,
  userDataValidator,
  signUpValidator,
};
