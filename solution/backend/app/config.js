const ENV = process.env.NODE_ENV || 'development';
const POSTGRESQL_URI =
  process.env.POSTGRESQL_URI || 'postgresql://localhost/linkedlist';
const PORT = process.env.PORT || 3000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'test';

module.exports = {
  ENV,
  JWT_SECRET_KEY,
  POSTGRESQL_URI,
  PORT
};
