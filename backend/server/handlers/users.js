// npm packages
const { Validator } = require('jsonschema');

// app imports
const { User } = require('../models');
const { userNewSchema, userUpdateSchema } = require('../schemas');
const {
  ensureCorrectUser,
  formatResponse,
  parseSkipLimit,
  validateSchema
} = require('../helpers');

// globals
const v = new Validator();

/**
 * List all the users. Query params ?skip=0&limit=1000 by default
 */
async function readUsers(request, response, next) {
  /* pagination validation */
  let skip = parseSkipLimit(request.query.skip, null, 'skip') || 0;
  let limit = parseSkipLimit(request.query.limit, 1000, 'limit') || 1000;
  if (typeof skip !== 'number') {
    return next(skip);
  } else if (typeof limit !== 'number') {
    return next(limit);
  }

  try {
    const { count, users } = await User.readUsers({}, {}, skip, limit);
    return response.json({ count, ...formatResponse(users) });
  } catch (err) {
    next(err);
  }
}

/**
 * Validate the POST request body and create a new User
 */
async function createUser(request, response, next) {
  const validSchema = validateSchema(
    v.validate(request.body, userNewSchema),
    'user'
  );
  if (validSchema !== 'OK') {
    return next(validSchema);
  }

  try {
    const newUser = await User.createUser(new User(request.body.data));
    return response.status(201).json(formatResponse(newUser));
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single user
 * @param {String} username - the username of the User to retrieve
 */
async function readUser(request, response, next) {
  const { username } = request.params;
  try {
    const user = await User.readUser(username);
    return response.json(formatResponse(user));
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single user
 * @param {String} username - the username of the User to update
 */
async function updateUser(request, response, next) {
  const { username } = request.params;

  const correctUser = ensureCorrectUser(
    request.headers.authorization,
    username
  );
  if (correctUser !== 'OK') {
    return next(correctUser);
  }
  const validSchema = validateSchema(
    v.validate(request.body, userUpdateSchema),
    'user'
  );
  if (validSchema !== 'OK') {
    return next(validSchema);
  }

  try {
    const user = await User.updateUser(username, request.body.data);
    return response.json(formatResponse(user));
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single user
 * @param {String} username - the username of the User to remove
 */
async function deleteUser(request, response, next) {
  const { username } = request.params;

  const correctUser = ensureCorrectUser(
    request.headers.authorization,
    username
  );
  if (correctUser !== 'OK') {
    return next(correctUser);
  }

  try {
    const deleteMsg = await User.deleteUser(username);
    return response.json(deleteMsg);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createUser,
  readUser,
  readUsers,
  updateUser,
  deleteUser
};
