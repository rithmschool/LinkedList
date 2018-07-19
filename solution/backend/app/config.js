// Environment Variables
const ENV = process.env.NODE_ENV || 'development';
let DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://localhost/linkedlist';
if (ENV === 'test') {
  DATABASE_URL = 'postgresql://localhost/linkedlist_test';
}
const PORT = process.env.PORT || 3000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'test';

module.exports = {
  ENV,
  JWT_SECRET_KEY,
  DATABASE_URL,
  PORT
};
