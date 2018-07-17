// npm packages
const jwt = require('jsonwebtoken');
// app imports
const { APIError } = require('../helpers');
const { JWT_SECRET_KEY } = require('../config');

function ensureAuth(req, res, next) {
  try {
    // token looks like: { Authorization: 'Bearer <token>'}
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    if (decoded.username) {
      // it's a user; attach the username to the request object
      req.username = decoded.username;
    } else if (decoded.handle) {
      // it's a company; attach the company handle to the request object
      req.handle = decoded.handle;
    }
    return next();
  } catch (e) {
    return next(
      new APIError(401, 'Unauthorized', 'Missing or invalid auth token.')
    );
  }
}

module.exports = ensureAuth;
