// npm packages
const { validate } = require('jsonschema');

// app imports
const db = require('../db');
const { APIError, partialUpdate, processOffsetLimit } = require('../helpers');
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
    let query, results;
    const { search } = req.query;

    if (search) {
      query = `SELECT * FROM jobs
                WHERE title ILIKE $1 OR company ILIKE $1 LIMIT $2 OFFSET $3`;
      results = await db.query(query, [`%${search}%`, limit, offset]);
    } else {
      query = 'SELECT * FROM jobs LIMIT $1 OFFSET $2';
      results = await db.query(query, [limit, offset]);
    }

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
  if (!req.handle) {
    return next(
      new APIError(403, 'Forbidden', 'Only companies are allowed to post jobs.')
    );
  }

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

  if (req.handle !== company) {
    return next(
      new APIError(
        403,
        'Forbidden',
        'You are not allowed to post a job on behalf of that company.'
      )
    );
  }

  try {
    const result = await db.query(
      'INSERT INTO jobs (title, salary, equity, company) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, salary, equity, company]
    );
    const newJob = result.rows[0];
    return res.status(201).json(newJob);
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

  if (!Number.isSafeInteger(+id)) {
    return next(
      new APIError(
        400,
        'Bad Request',
        `Job IDs must consist only of valid integers. '${id}' is not a valid integer..`
      )
    );
  }

  try {
    const result = await db.query('SELECT * FROM jobs WHERE id=$1', [id]);
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

  if (!Number.isSafeInteger(+id)) {
    return next(
      new APIError(
        400,
        'Bad Request',
        `Job IDs must consist only of valid integers. '${id}' is not a valid integer..`
      )
    );
  }

  const checkJob = await db.query('SELECT * FROM jobs WHERE id=$1', [id]);
  if (!checkJob.rows[0]) {
    return next(
      new APIError(404, 'Job Not Found', `No Job with ID '${id}' found.`)
    );
  }
  const companyHandle = checkJob.rows[0].company;

  if (!req.handle || req.handle !== companyHandle) {
    return next(
      new APIError(
        403,
        'Forbidden',
        'You are not allowed to edit this job posting.'
      )
    );
  }

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

  try {
    let updateFields = { ...req.body };

    let { query, values } = partialUpdate('jobs', updateFields, 'id', id);

    const result = await db.query(query, values);
    const updatedJob = result.rows[0];

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

  if (!Number.isSafeInteger(+id)) {
    return next(
      new APIError(
        400,
        'Bad Request',
        `Job IDs must consist only of valid integers. '${id}' is not a valid integer..`
      )
    );
  }

  const checkJob = await db.query('SELECT * FROM jobs WHERE id=$1', [id]);
  if (!checkJob.rows[0]) {
    return next(
      new APIError(404, 'Job Not Found', `No Job with ID '${id}' found.`)
    );
  }
  const companyHandle = checkJob.rows[0].company;

  if (!req.handle || req.handle !== companyHandle) {
    return next(
      new APIError(
        403,
        'Forbidden',
        'You are not allowed to delete this job posting.'
      )
    );
  }

  try {
    const result = await db.query('DELETE FROM jobs WHERE id=$1 RETURNING *', [
      id
    ]);
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
