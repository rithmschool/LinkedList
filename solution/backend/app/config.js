// Environment Variables
const ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://localhost/linkedlist';
const PORT = process.env.PORT || 3000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'test';

module.exports = {
  ENV,
  JWT_SECRET_KEY,
  DATABASE_URL,
  PORT
};
