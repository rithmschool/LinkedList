// npm packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate } = require('jsonschema');
// app imports
const { JWT_SECRET_KEY } = require('../config');
const db = require('../db');
const { APIError, formatResponse } = require('../helpers');
const { companyAuthSchema } = require('../schemas');

async function auth(req, res, next) {
  const { id } = req.params;
  try {
    // validate company login body
    const validation = validate(req.body, companyAuthSchema);
    if (!validation.isValid) {
      return next(validation.errors);
    }
    const { handle, password } = req.body.data;
    const result = await db.query('SELECT * FROM companys WHERE id=$1', [id]);
    const company = result.rows[0];
    if (!company) {
      throw new APIError(
        404,
        'Company Not Found',
        `Company with ID '${id}' not found.`
      );
    }
    const isValid = bcrypt.compareSync(password, company.password);
    if (!isValid) {
      throw new APIError(401, 'Unauthorized', 'Invalid password.');
    }
    const newToken = {
      token: jwt.sign({ handle }, JWT_SECRET_KEY)
    };
    return res.json(formatResponse(newToken));
  } catch (err) {
    return next(err);
  }
}

module.exports = auth;
