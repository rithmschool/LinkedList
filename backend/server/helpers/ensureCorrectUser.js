// npm packages
const jwt = require('jsonwebtoken');

// app imports
const { APIError } = require('../helpers');

/**
 * Make sure the token lines up with the correct username or handle
 * @param {String} authHeader Authorization: `Bearer <token>`
 * @param {String} correctUser the expected username or company handle
 * @param {Boolean} company is the user a company or just a regular user
 */
function ensureCorrectUser(authHeader, correctUser, company) {
  const key = company ? 'handle' : 'username';

  if (!authHeader) {
    return new APIError(
      401,
      'Unauthorized',
      'Authorization header with valid token required.'
    );
  }
  if (!authHeader.includes('Bearer')) {
    return new APIError(
      401,
      'Unauthorized',
      'Authorization header must have format: `Bearer token`.'
    );
  }
  const token = authHeader.split(' ')[1];
  let currentUser;
  try {
    currentUser = jwt.decode(token, { json: true })[key];
  } catch (e) {
    return e;
  }
  if (currentUser !== correctUser) {
    return new APIError(
      401,
      'Unauthorized',
      'You are not authorized to make changes to this resource because permissions belong to another user.'
    );
  }
  return 'OK';
}

module.exports = ensureCorrectUser;
