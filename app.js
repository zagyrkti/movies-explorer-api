const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('./middleware/cors');
const { requestLogger, errorLogger } = require('./middleware/loggers');
const errorsHandler = require('./middleware/errors-handler');
const mainRouter = require('./routes/main-router');
const rateLimiter = require('./middleware/rate-limiter');
const { PORT, DB_URI } = require('./utils/config');

const app = express();

mongoose.connect(DB_URI);

app.use(requestLogger);
app.use(rateLimiter);

app.use(helmet());
app.use(cors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(mainRouter);

app.use(errorLogger);

/* обработчик ошибок celebrate */
app.use(errors());
/* основной обработчик ошибок */
app.use(errorsHandler);

app.listen(PORT);
