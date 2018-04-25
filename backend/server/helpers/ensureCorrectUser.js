// app imports
const APIError = require('./APIError');
const parseToken = require('./parseToken');

/**
 * Make sure the token lines up with the correct username or handle
 * @param {String} authHeader Authorization: `Bearer <token>`
 * @param {String} correctUser the expected username or company handle
 * @param {Boolean} company is the user a company or just a regular user
 */
function ensureCorrectUser(authHeader, correctUser, company) {
  const key = company ? 'handle' : 'username';

  const token = parseToken(authHeader);
  if (token instanceof APIError) {
    return token;
  }

  if (token[key] !== correctUser) {
    return new APIError(
      401,
      'Unauthorized',
      'You are not authorized to make changes to this resource because permissions belong to another user.'
    );
  }

  if (token.company !== !!company) {
    return new APIError(
      401,
      'Unauthorized',
      'You do not have the correct privileges to make changes to this resource because of your user type.'
    );
  }
  return 'OK';
}

module.exports = ensureCorrectUser;
