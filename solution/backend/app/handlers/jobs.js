// npm packages
const { validate } = require('jsonschema');

// app imports
const db = require('../db');
const { APIError, processOffsetLimit } = require('../helpers');
const { jobNewSchema, jobUpdateSchema } = require('../schemas');

/**
 * List all the jobs. Query params ?offset=0&limit=1000 by default
 */
async function readJobs(req, res, next) {
  /* pagination validation */
  let { offset, limit } = processOffsetLimit(req.query.offset, req.query.limit);
  if (offset && offset instanceof APIError) {
    return next(offset);
  } else if (limit && limit instanceof APIError) {
    return next(limit);
  }

  try {
    let query = 'SELECT * FROM jobs';
    if (limit) {
      query += `LIMIT ${limit}`;
    }
    if (offset) {
      query += `OFFSET ${offset}`;
    }
    const results = await db.query(query);
    const jobs = results.rows;
    return res.json(jobs);
  } catch (err) {
    return next(err);
  }
}

/**
 * Validate the POST req body and create a new Job
 */
async function createJob(req, res, next) {
  const validation = validate(req.body, jobNewSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        'Bad Request',
        validation.errors.map(e => e.stack).join('. ')
      )
    );
  }

  const { title, salary, equity, company } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO jobs (title, salary, equity, company) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, salary, equity, company]
    );
    const newJob = result.rows[0];
    return res.json(newJob);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single job
 * @param {String} id - the id of the Job to retrieve
 */
async function readJob(req, res, next) {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM jobs WHERE id=$1', [
      req.params.id
    ]);
    const job = result.rows[0];
    if (!job) {
      return next(
        new APIError(404, 'Job Not Found', `No Job with ID '${id}' found.`)
      );
    }
    return res.json(job);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single job
 * @param {String} id - the id of the Job to update
 */
async function updateJob(req, res, next) {
  const { id } = req.params;

  const validation = validate(req.body, jobUpdateSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        'Bad Request',
        validation.errors.map(e => e.stack).join('. ')
      )
    );
  }

  const { title, salary, equity, company } = req.body;

  try {
    const result = await db.query(
      'UPDATE jobs SET title=($1), salary=($2), equity=($3), company=($4) WHERE id=($5) RETURNING *',
      [title, salary, equity, company, id]
    );

    const updatedJob = result.rows[0];
    if (!updatedJob) {
      return next(
        new APIError(404, 'Job Not Found', `No Job with ID '${id}' found.`)
      );
    }

    return res.json(updatedJob);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single job
 * @param {String} id - the id of the Job to remove
 */
async function deleteJob(req, res, next) {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM jobs WHERE id=$1', [id]);
    const deletedJob = result.rows[0];
    return res.json(deletedJob);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createJob,
  readJob,
  readJobs,
  updateJob,
  deleteJob
};
