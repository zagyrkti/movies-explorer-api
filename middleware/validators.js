const { celebrate, Joi, Segments } = require('celebrate');

const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
const passwordPattern = /^[-a-zA-Z0-9()@:%_+.~#?&/=]{3,20}$/;

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
    trailerLink: Joi.string().required().pattern(urlPattern),
    image: Joi.string().required().pattern(urlPattern),
    thumbnail: Joi.string().required().pattern(urlPattern),
  }),
});

const loginValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(passwordPattern)
      .message('Пароль от 3 до 30 символов. Допустимые символы -a-zA-Z0-9()@:%_+.~#?&/='),
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
    email: Joi.string().required().email(),
  }),
});

const signUpValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(passwordPattern)
      .message('Пароль от 3 до 30 символов. Допустимые символы -a-zA-Z0-9()@:%_+.~#?&/='),
  }),
});

module.exports = {
  movieSignatureValidator,
  loginValidator,
  idSignatureValidator,
  userDataValidator,
  signUpValidator,
};
