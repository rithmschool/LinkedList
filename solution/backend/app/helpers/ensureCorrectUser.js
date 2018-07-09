// app imports
const APIError = require('./APIError');
const parseToken = require('./parseToken');

/**
 * Make sure the token lines up with the correct username or handle
 * @param {String} authHeader Authorization: `Bearer <token>`
 * @param {String} correctUser the expected id
 * @param {Boolean} company is the user a company or just a regular user?
 */
function ensureCorrectUser(authHeader, id, company) {
  const token = parseToken(authHeader);
  if (token instanceof APIError) {
    return token;
  }

  if (token.id !== id) {
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
  return 'correct';
}

module.exports = ensureCorrectUser;
