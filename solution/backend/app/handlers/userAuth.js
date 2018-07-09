// npm packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate } = require('jsonschema');
// app imports
const { JWT_SECRET_KEY } = require('../config');
const db = require('../db');
const { APIError, formatResponse } = require('../helpers');
const { userAuthSchema } = require('../schemas');

async function auth(req, res, next) {
  const { id } = req.params;
  try {
    // validate user login body
    const validation = validate(req.body, userAuthSchema);
    if (!validation.isValid) {
      return next(validation.errors);
    }
    const { username, password } = req.body.data;
    const result = await db.query('SELECT * FROM users WHERE id=$1', [id]);
    const user = result.rows[0];
    if (!user) {
      throw new APIError(
        404,
        'User Not Found',
        `User with ID '${id}' not found.`
      );
    }
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      throw new APIError(401, 'Unauthorized', 'Invalid password.');
    }
    const newToken = {
      token: jwt.sign({ username }, JWT_SECRET_KEY)
    };
    return res.json(formatResponse(newToken));
  } catch (err) {
    return next(err);
  }
}

module.exports = auth;
