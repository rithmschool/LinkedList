const ENV = process.env.NODE_ENV;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/linkedlist';
const PORT = process.env.PORT || 5000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'test';

module.exports = {
  ENV,
  JWT_SECRET_KEY,
  MONGODB_URI,
  PORT
};
