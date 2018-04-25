// npm packages
const jwt = require('jsonwebtoken');
const { Validator } = require('jsonschema');
const bcrypt = require('bcrypt');
// app imports
const { JWT_SECRET_KEY } = require('../config');
const { Company } = require('../models');
const { APIError, formatResponse, validateSchema } = require('../helpers');
const { companyAuthSchema } = require('../schemas');

// global constants
const v = new Validator();

async function auth(request, response, next) {
  try {
    // validate company login body
    const validSchema = validateSchema(
      v.validate(request.body, companyAuthSchema),
      'company'
    );
    if (validSchema !== 'OK') {
      return next(validSchema);
    }
    const { handle, password } = request.body.data;
    const company = await Company.readCompany(handle);
    const isValid = bcrypt.compareSync(password, company.password);
    if (!isValid) {
      throw new APIError(401, 'Unauthorized', 'Invalid password.');
    }
    const newToken = {
      token: jwt.sign({ handle }, JWT_SECRET_KEY)
    };
    return response.json(formatResponse(newToken));
  } catch (err) {
    return next(err);
  }
}

module.exports = auth;
