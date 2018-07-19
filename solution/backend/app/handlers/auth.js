// npm packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate } = require('jsonschema');
// app imports
const { APIError } = require('../helpers');
const db = require('../db');
const { companyAuthSchema, userAuthSchema } = require('../schemas');

// global constants
const { JWT_SECRET_KEY } = require('../config');

async function user(req, res, next) {
  try {
    // validate user login body
    const validation = validate(req.body, userAuthSchema);
    if (!validation.valid) {
      return next(
        new APIError(
          400,
          'Bad Request',
          validation.errors.map(e => e.stack).join('. ')
        )
      );
    }
    const { username, password } = req.body;

    // check if user exists
    const result = await db.query('SELECT * FROM users WHERE username=$1', [
      username
    ]);
    const user = result.rows[0];
    if (!user) {
      throw new APIError(
        404,
        'User Not Found',
        `User with username '${username}' not found.`
      );
    }

    // check if password is correct
    const correctPassword = bcrypt.compareSync(password, user.password);
    if (!correctPassword) {
      throw new APIError(401, 'Unauthorized', 'Invalid password.');
    }
    const newToken = {
      token: jwt.sign({ username }, JWT_SECRET_KEY)
    };
    return res.json(newToken);
  } catch (err) {
    return next(err);
  }
}

async function company(req, res, next) {
  try {
    // validate company login body
    const validation = validate(req.body, companyAuthSchema);
    if (!validation.valid) {
      return next(
        new APIError(
          400,
          'Bad Request',
          validation.errors.map(e => e.stack).join('. ')
        )
      );
    }
    const { handle, password } = req.body;

    // check if the company exists
    const result = await db.query('SELECT * FROM companies WHERE handle=$1', [
      handle
    ]);
    const company = result.rows[0];
    if (!company) {
      throw new APIError(
        404,
        'Company Not Found',
        `Company with handle '${handle}' not found.`
      );
    }

    // check if the password was correct
    const correctPassword = bcrypt.compareSync(password, company.password);
    if (!correctPassword) {
      throw new APIError(401, 'Unauthorized', 'Invalid password.');
    }
    const newToken = {
      token: jwt.sign({ handle }, JWT_SECRET_KEY)
    };

    return res.json(newToken);
  } catch (err) {
    return next(err);
  }
}

module.exports = { user, company };
