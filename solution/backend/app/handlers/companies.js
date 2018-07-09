// npm packages
const { validate } = require('jsonschema');

// app imports
const db = require('../db');
const {
  APIError,
  ensureCorrectUser,
  formatResponse,
  processOffsetLimit
} = require('../helpers');
const { companyNewSchema, companyUpdateSchema } = require('../schemas');

/**
 * List all the companies. Query params ?offset=0&limit=1000 by default
 */
async function readCompanies(req, res, next) {
  /* pagination validation */
  let { offset, limit } = processOffsetLimit(req.query.offset, req.query.limit);
  if (offset && typeof offset !== 'number') {
    return next(offset);
  } else if (limit && typeof limit !== 'number') {
    return next(limit);
  }

  try {
    let query = 'SELECT * FROM companies';
    if (limit) {
      query += `LIMIT ${limit}`;
    }
    if (offset) {
      query += `OFFSET ${offset}`;
    }
    const results = await db.query(query);
    const companies = results.rows;
    return res.json(formatResponse(companies));
  } catch (err) {
    return next(err);
  }
}

/**
 * Validate the POST req body and create a new Company
 */
async function createCompany(req, res, next) {
  const validation = validate(req.body, companyNewSchema);
  if (!validation.isValid) {
    return next(validation.errors);
  }

  const { name, logo, handle, password } = req.body.data;

  try {
    const result = await db.query(
      'INSERT INTO companies (name, logo, handle, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, logo, handle, password]
    );
    const newCompany = result.rows[0];
    return res.json(formatResponse(newCompany));
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single company
 * @param {String} id - the id of the Company to retrieve
 */
async function readCompany(req, res, next) {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM companies WHERE id=$1', [
      req.params.id
    ]);
    const company = result.rows[0];
    if (!company) {
      return next(
        new APIError(
          404,
          'Company Not Found',
          `No Company with ID ${id} found.`
        )
      );
    }
    const users = await db.query('SELECT * FROM users WHERE company_id=$1', [
      req.params.id
    ]);
    const jobs = await db.query('SELECT * FROM jobs WHERE company_id=$1', [
      req.params.id
    ]);
    company.users = users.rows.map(u => u.id);
    company.jobs = jobs.rows.map(j => j.id);
    return res.json(formatResponse(company));
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single company
 * @param {String} id - the id of the Company to update
 */
async function updateCompany(req, res, next) {
  const { id } = req.params;

  const correctCompany = ensureCorrectUser(req.headers.authorization, id, true);
  if (correctCompany !== 'correct') {
    return next(correctCompany);
  }

  const validation = validate(req.body, companyUpdateSchema);
  if (!validation.isValid) {
    return next(validation.errors);
  }

  const { name, logo, handle, password } = req.body.data;

  try {
    const result = await db.query(
      'UPDATE companies SET name=($1), logo=($2), handle=($3), password=($4) WHERE id=($5) RETURNING *',
      [name, logo, handle, password, id]
    );

    const updatedCompany = result.rows[0];
    if (!updatedCompany) {
      return next(
        new APIError(
          404,
          'Company Not Found',
          `No Company with ID ${id} found.`
        )
      );
    }

    return res.json(formatResponse(updatedCompany));
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single company
 * @param {String} id - the id of the Company to remove
 */
async function deleteCompany(req, res, next) {
  const { id } = req.params;

  const correctCompany = ensureCorrectUser(req.headers.authorization, id, true);
  if (correctCompany !== 'correct') {
    return next(correctCompany);
  }

  try {
    const result = await db.query('DELETE FROM companies WHERE id=$1', [id]);
    const deletedCompany = result.rows[0];
    return res.json(formatResponse(deletedCompany));
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
