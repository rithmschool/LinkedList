// npm packages
const { Validator } = require('jsonschema');

// app imports
const { Company } = require('../models');
const { companyNewSchema, companyUpdateSchema } = require('../schemas');
const {
  parseSkipLimit,
  validateSchema,
  ensureCorrectCompany,
  formatResponse
} = require('../helpers');

// globals
const v = new Validator();

/**
 * List all the companies. Query params ?skip=0&limit=1000 by default
 */
async function readCompanies(request, response, next) {
  /* pagination validation */
  let skip = parseSkipLimit(request.query.skip, null, 'skip') || 0;
  let limit = parseSkipLimit(request.query.limit, 1000, 'limit') || 1000;
  if (typeof skip !== 'number') {
    return next(skip);
  } else if (typeof limit !== 'number') {
    return next(limit);
  }

  try {
    const companies = await Company.readCompanies({}, {}, skip, limit);
    return response.json(formatResponse(companies));
  } catch (err) {
    next(err);
  }
}

/**
 * Validate the POST request body and create a new Company
 */
async function createCompany(request, response, next) {
  const validSchema = validateSchema(
    v.validate(request.body, companyNewSchema),
    'company'
  );
  if (validSchema !== 'OK') {
    return next(validSchema);
  }

  try {
    const newCompany = await Company.createCompany(
      new Company(request.body.data)
    );
    return response.status(201).json(formatResponse(newCompany));
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single company
 * @param {String} handle - the handle of the Company to retrieve
 */
async function readCompany(request, response, next) {
  const { handle } = request.params;
  try {
    const company = await Company.readCompany(handle);
    return response.json(formatResponse(company));
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single company
 * @param {String} handle - the handle of the Company to update
 */
async function updateCompany(request, response, next) {
  const { handle } = request.params;

  const correctCompany = ensureCorrectCompany(
    request.headers.authorization,
    handle
  );
  if (correctCompany !== 'OK') {
    return next(correctCompany);
  }
  const validationErrors = validateSchema(
    v.validate(request.body, companyUpdateSchema),
    'company'
  );
  if (validationErrors.length > 0) {
    return next(validationErrors);
  }

  try {
    const company = await Company.updateCompany(handle, request.body.data);
    return response.json(formatResponse(company));
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single company
 * @param {String} handle - the handle of the Company to remove
 */
async function deleteCompany(request, response, next) {
  const { handle } = request.params;

  const correctCompany = ensureCorrectCompany(
    request.headers.authorization,
    handle
  );
  if (correctCompany !== 'OK') {
    return next(correctCompany);
  }
  try {
    const deleteMsg = await Company.deleteCompany(handle);
    return response.json(formatResponse(deleteMsg));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createCompany,
  readCompany,
  readCompanies,
  updateCompany,
  deleteCompany
};
