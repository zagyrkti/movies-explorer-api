const errorMessages = {
  resourceNotFound: 'Ресурс не найден',
  validationError: 'Ошибка валидации данных',
  savedFilmsNotFound: 'У текущего пользователя отсутствуют сохраненные фильмы',
  filmNotFound: 'Фильм по указанному id не найден',
  notEnoughRightsToDeleteFilm: 'Удалить фильм может только владелец',
  incorrectId: 'Некорректный id',
  userWithCurrenIdNotFound: 'Пользователь с текущим id не найден',
  emailDuplication: 'Пользователь с указанным email уже зарегистрирован',
  passwordOrEmailCheckFailed: 'Неправильные почта или пароль',
};

module.exports = errorMessages;
