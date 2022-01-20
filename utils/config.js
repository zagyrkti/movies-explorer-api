require('dotenv').config();

const { PORT = 3000 } = process.env;

const { NODE_ENV, JWT_SECRET_PROD } = process.env;
const JWT_SECRET = NODE_ENV === 'production' ? JWT_SECRET_PROD : 'secret-key';

const { DB_URI_PROD } = process.env;
const DB_URI_DEV = 'mongodb://localhost:27017/moviesdb';
const DB_URI = NODE_ENV === 'production' ? DB_URI_PROD : DB_URI_DEV;

module.exports = {
  PORT,
  DB_URI,
  JWT_SECRET,
};
