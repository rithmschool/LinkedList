// npm packages
const jwt = require('jsonwebtoken');

// app imports
const { APIError } = require('../helpers');

/**
 * Parse the Auth header and determine if user is a company or a user based on the token
 * @param {String} authHeader Authorization Header (request.headers.authorization)
 */
function parseToken(authHeader) {
  if (!authHeader) {
    return new APIError(
      401,
      'Unauthorized',
      'Authorization header with valid token required.'
    );
  }
  if (!authHeader.includes('Bearer ')) {
    return new APIError(
      401,
      'Unauthorized',
      'Authorization header must have format: `Bearer token`.'
    );
  }
  const token = authHeader.split(' ')[1];
  let currentUser;
  try {
    currentUser = jwt.decode(token, { json: true });
  } catch (e) {
    return e;
  }
  if (!currentUser) {
    return new APIError(
      401,
      'Unauthorized',
      'Authorization header with valid token required.'
    );
  }
  if (currentUser.handle) {
    return { company: true, handle: currentUser.handle };
  }
  return { company: false, username: currentUser.username };
}

module.exports = parseToken;
