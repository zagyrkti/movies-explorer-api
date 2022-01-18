class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MongoServerError';
    this.code = 11000;
  }
}

module.exports = DuplicateError;
