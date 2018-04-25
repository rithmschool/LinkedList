// npm packages
const jwt = require('jsonwebtoken');
const { Validator } = require('jsonschema');
const bcrypt = require('bcrypt');
// app imports
const { JWT_SECRET_KEY } = require('../config');
const { User } = require('../models');
const { APIError, formatResponse, validateSchema } = require('../helpers');
const { userAuthSchema } = require('../schemas');

// global constants
const v = new Validator();

async function auth(request, response, next) {
  try {
    // validate user login body
    const validSchema = validateSchema(
      v.validate(request.body, userAuthSchema),
      'user'
    );
    if (validSchema !== 'OK') {
      return next(validSchema);
    }
    const { username, password } = request.body.data;
    const user = await User.findOne({ username }).lean();
    if (!user) {
      throw new APIError(
        404,
        'User Not Found',
        `User '${username}' does not exist.`
      );
    }
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      throw new APIError(401, 'Unauthorized', 'Invalid password.');
    }
    const newToken = {
      token: jwt.sign({ username }, JWT_SECRET_KEY)
    };
    return response.json(formatResponse(newToken));
  } catch (err) {
    return next(err);
  }
}

module.exports = auth;
