/* eslint-disable consistent-return */

const cors = (req, res, next) => {
  const allowedCors = [
    'https://mesto.zagyrkti.nomoredomains.rocks',
    'http://mesto.zagyrkti.nomoredomains.rocks',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:4000',
    'https://localhost:4000',
  ];

  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  /* res.header('Access-Control-Allow-Origin', '*'); */

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
};

module.exports = cors;
