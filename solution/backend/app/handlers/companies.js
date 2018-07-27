// npm packages
const bcrypt = require('bcrypt');
const { validate } = require('jsonschema');

// app imports
const db = require('../db');
const { APIError, partialUpdate, processOffsetLimit } = require('../helpers');
const { companyNewSchema, companyUpdateSchema } = require('../schemas');
const { SALT_FACTOR } = require('../config');

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
    let query, results;
    const { search } = req.query;

    if (search) {
      query = `SELECT handle, logo, name, email FROM companies
      WHERE name ILIKE $1 OR handle ILIKE $1 LIMIT $2 OFFSET $3`;
      results = await db.query(query, [`%${search}%`, limit, offset]);
    } else {
      query =
        'SELECT handle, logo, name, email FROM companies LIMIT $1 OFFSET $2';
      results = await db.query(query, [limit, offset]);
    }

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
  const { name, logo, handle, password, email } = req.body;
  const duplicateCheck = await db.query(
    'SELECT * FROM companies WHERE handle=$1',
    [handle]
  );

  if (duplicateCheck.rows[0]) {
    return next(
      new APIError(
        409,
        'Conflict',
        `There already exists a company with handle '${handle}'.`
      )
    );
  }
  // hash password
  const hashedPassword = await bcrypt.hash(password, SALT_FACTOR);

  try {
    const result = await db.query(
      `INSERT INTO companies (name, logo, handle, password, email)
        VALUES ($1, $2, $3, $4, $5) RETURNING  handle, name, logo, email`,
      [name, logo, handle, hashedPassword, email]
    );
    const newCompany = result.rows[0];
    return res.status(201).json(newCompany);
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
    const result = await db.query(
      'SELECT handle, name, logo FROM companies WHERE handle=$1',
      [handle]
    );
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
      'SELECT username FROM users WHERE current_company=$1',
      [handle]
    );
    const jobs = await db.query('SELECT id FROM jobs WHERE company=$1', [
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

  if (!req.handle || req.handle !== handle) {
    return next(
      new APIError(
        403,
        'Forbidden',
        'You are not allowed to edit this company.'
      )
    );
  }

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

  let updateFields = { ...req.body };
  if (updateFields.password) {
    updateFields.password = await bcrypt.hash(
      updateFields.password,
      SALT_FACTOR
    );
  }

  try {
    let { query, values } = partialUpdate(
      'companies',
      updateFields,
      'handle',
      handle
    );

    const result = await db.query(query, values);

    const updatedCompany = result.rows[0];
    if (!updatedCompany) {
      return next(
        new APIError(
          404,
          'Company Not Found',
          `No Company with handle '${handle}' found.`
        )
      );
    }
    delete updatedCompany.password;

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

  if (!req.handle || req.handle !== handle) {
    return next(
      new APIError(
        403,
        'Forbidden',
        'You are not allowed to delete this company.'
      )
    );
  }

  try {
    const result = await db.query(
      'DELETE FROM companies WHERE handle=$1 RETURNING *',
      [handle]
    );
    const deletedCompany = result.rows[0];
    if (!deletedCompany) {
      return next(
        new APIError(
          404,
          'Company Not Found',
          `No Company with handle '${handle}' found.`
        )
      );
    }
    delete deletedCompany.password;
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
