// npm packages
const { validate } = require('jsonschema');

// app imports
const db = require('../db');
const { APIError, processOffsetLimit } = require('../helpers');
const { companyNewSchema, companyUpdateSchema } = require('../schemas');

/**
 * List all the companies. Query params ?offset=0&limit=1000 by default
 */
async function readCompanies(req, res, next) {
  /* pagination validation */
  let { offset, limit } = processOffsetLimit(req.query.offset, req.query.limit);
  if (offset && offset instanceof APIError) {
    return next(offset);
  } else if (limit && limit instanceof APIError) {
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
    return res.json(companies);
  } catch (err) {
    return next(err);
  }
}

/**
 * Validate the POST req body and create a new Company
 */
async function createCompany(req, res, next) {
  const validation = validate(req.body, companyNewSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        'Bad Request',
        validation.errors.map(e => e.stack).join('. ')
      )
    );
  }
  const { name, logo, handle, password } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO companies (name, logo, handle, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, logo, handle, password]
    );
    const newCompany = result.rows[0];
    return res.json(newCompany);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single company
 * @param {String} handle - the handle of the Company to retrieve
 */
async function readCompany(req, res, next) {
  const { handle } = req.params;

  try {
    const result = await db.query('SELECT * FROM companies WHERE handle=$1', [
      handle
    ]);
    const company = result.rows[0];
    if (!company) {
      return next(
        new APIError(
          404,
          'Company Not Found',
          `No Company with handle '${handle}' found.`
        )
      );
    }
    const users = await db.query(
      'SELECT * FROM users WHERE current_company=$1',
      [handle]
    );
    const jobs = await db.query('SELECT * FROM jobs WHERE company=$1', [
      handle
    ]);
    company.users = users.rows.map(u => u.username);
    company.jobs = jobs.rows.map(j => j.id);
    return res.json(company);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single company
 * @param {String} handle - the handle of the Company to update
 */
async function updateCompany(req, res, next) {
  const { handle } = req.params;

  const validation = validate(req.body, companyUpdateSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        'Bad Request',
        validation.errors.map(e => e.stack).join('. ')
      )
    );
  }

  const { name, logo, password } = req.body;

  try {
    const result = await db.query(
      'UPDATE companies SET name=($1), logo=($2), handle=($3), password=($4) WHERE handle=($5) RETURNING *',
      [name, logo, handle, password, handle]
    );

    const updatedCompany = result.rows[0];
    if (!updatedCompany) {
      return next(
        new APIError(
          404,
          'Company Not Found',
          `No Company with handle ${handle} found.`
        )
      );
    }

    return res.json(updatedCompany);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single company
 * @param {String} handle - the handle of the Company to remove
 */
async function deleteCompany(req, res, next) {
  const { handle } = req.params;

  try {
    const result = await db.query('DELETE FROM companies WHERE handle=$1', [
      handle
    ]);
    const deletedCompany = result.rows[0];
    return res.json(deletedCompany);
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
