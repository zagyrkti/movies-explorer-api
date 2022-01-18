function errorsHandler(err, req, res, next) {
  const error = err.name ? err : err.error;
  const { errorData = {} } = err;
  const BAD_REQUEST = 400;
  const NOT_FOUND = 404;
  const INTERNAL_SERVER_ERROR = 500;
  const CONFLICT = 409;
  const UNAUTHORIZED = 401;
  const FORBIDDEN = 403;

  const castError = error.name === 'CastError';
  const validationError = error.name === 'ValidationError';

  if (castError || validationError) {
    const info = errorData[BAD_REQUEST] ? errorData[BAD_REQUEST] : error.message;
    res.status(BAD_REQUEST).send({
      message: info,
    });
    return;
  }

  const notFoundError = error.name === 'DocumentNotFoundError' || error.name === 'NotFoundError';

  if (notFoundError) {
    const info = errorData[NOT_FOUND] ? errorData[NOT_FOUND] : error.message;
    res.status(NOT_FOUND).send({
      message: info,
    });
    return;
  }

  const DuplicateError = error.code === 11000;

  if (DuplicateError) {
    const info = errorData[CONFLICT] ? errorData[CONFLICT] : error.message;
    res.status(CONFLICT).send({ message: info });
    return;
  }

  const UnauthorizedError = error.name === 'UnauthorizedError';

  if (UnauthorizedError) {
    const info = errorData[UNAUTHORIZED] ? errorData[UNAUTHORIZED] : error.message;
    res.status(UNAUTHORIZED).send({ message: info });
    return;
  }

  const ForbiddenError = error.name === 'ForbiddenError';

  if (ForbiddenError) {
    const info = errorData[FORBIDDEN] ? errorData[FORBIDDEN] : error.message;
    res.status(FORBIDDEN).send({ message: info });
    return;
  }

  const unknownError = 'Internal Server Error';

  res.status(INTERNAL_SERVER_ERROR).send({
    message: unknownError,
  });

  next();
}

module.exports = errorsHandler;
