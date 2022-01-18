module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': ['error', {
      allow: ['_id'],
    }],
    'object-curly-newline': ['error', {
      ExportDeclaration: {
        multiline: true, minProperties: 5,
      },
    }],
  },
};
