const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('./middleware/cors');

const { requestLogger, errorLogger } = require('./middleware/loggers');
const NotFoundError = require('./errors/not-found-error');
const errorsHandler = require('./middleware/errors-handler');
const mainRouter = require('./routes/main-router');

require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

app.use(requestLogger);

app.use((req, res, next) => {
  req.user = {
    _id: '61e71bd68b89b738ab041277',
  };
  next();
});

app.use(mainRouter);

app.all('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

app.use(errorLogger);

/* обработчик ошибок celebrate */
app.use(errors());
/* основной обработчик ошибок */
app.use(errorsHandler);

app.listen(PORT);
