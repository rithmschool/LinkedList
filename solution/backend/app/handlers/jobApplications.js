// app imports
const db = require('../db');
const { APIError, processOffsetLimit } = require('../helpers');

/**
 * Only users can apply for jobs
 */
async function applyForJob(req, res, next) {
  const { jobId } = req.params;
  const { username } = req;
  try {
    if (!Number.isSafeInteger(+jobId)) {
      return next(
        new APIError(
          400,
          'Bad Request',
          `Job IDs must consist only of valid integers. '${jobId}' is not a valid integer.`
        )
      );
    }

    if (!username) {
      return next(
        new APIError(403, 'Forbidden', 'Only users can apply for jobs.')
      );
    }

    let jobQuery = await db.query(`SELECT * FROM jobs WHERE id=$1`, [jobId]);
    let job = jobQuery.rows[0];

    if (!job) {
      return next(
        new APIError(404, 'Not Found', `No job with ID ${jobId} was found.`)
      );
    }

    const duplicateCheck = await db.query(
      'SELECT * FROM jobs_users WHERE job_id=$1 AND username=$2',
      [jobId, username]
    );

    if (duplicateCheck.rows[0]) {
      return next(
        new APIError(409, 'Conflict', `You have already applied for this job.`)
      );
    }

    const result = await db.query(
      `INSERT INTO jobs_users (job_id, username)
        VALUES ($1, $2) RETURNING *`,
      [jobId, username]
    );
    const newJobApp = result.rows[0];
    return res.status(201).json(newJobApp);
  } catch (err) {
    return next(err);
  }
}

/**
 * List all the job applications. Query params ?offset=0&limit=50 by default
 */
async function readJobApplications(req, res, next) {
  /* pagination validation */
  try {
    let { offset, limit } = processOffsetLimit(
      req.query.offset,
      req.query.limit
    );
    if (offset && offset instanceof APIError) {
      return next(offset);
    } else if (limit && limit instanceof APIError) {
      return next(limit);
    }

    const { jobId } = req.params;

    if (!Number.isSafeInteger(+jobId)) {
      return next(
        new APIError(
          400,
          'Bad Request',
          `Job IDs must consist only of valid integers. '${jobId}' is not a valid integer.`
        )
      );
    }

    let jobQuery = await db.query(`SELECT * FROM jobs WHERE id=$1`, [jobId]);
    let job = jobQuery.rows[0];

    if (!job) {
      return next(
        new APIError(404, 'Not Found', `No job with ID ${jobId} was found.`)
      );
    }

    if (req.handle && req.handle !== job.company) {
      return next(
        new APIError(
          403,
          'Forbidden',
          'You are not allowed to see applications for this job.'
        )
      );
    }

    let query, results;

    if (req.username) {
      query = `SELECT * FROM jobs_users WHERE job_id=$1 AND username=$2 LIMIT $3 OFFSET $4`;
      results = await db.query(query, [jobId, req.username, limit, offset]);
    } else if (req.handle) {
      query = `SELECT * FROM jobs_users WHERE job_id=$1 LIMIT $2 OFFSET $3`;
      results = await db.query(query, [jobId, limit, offset]);
    }

    const jobs = results.rows;
    return res.json(jobs);
  } catch (err) {
    return next(err);
  }
}

/**
 * List a single job application
 */
async function readJobApplication(req, res, next) {
  const { jobId, applicationId } = req.params;
  try {
    if (!Number.isSafeInteger(+jobId)) {
      return next(
        new APIError(
          400,
          'Bad Request',
          `Job IDs must consist only of valid integers. '${jobId}' is not a valid integer.`
        )
      );
    }

    let jobQuery = await db.query(`SELECT * FROM jobs WHERE id=$1`, [jobId]);
    let job = jobQuery.rows[0];

    if (!job) {
      return next(
        new APIError(404, 'Not Found', `No job with ID ${jobId} was found.`)
      );
    }

    if (!Number.isSafeInteger(+applicationId)) {
      return next(
        new APIError(
          400,
          'Bad Request',
          `Job Application IDs must consist only of valid integers. '${applicationId}' is not a valid integer.`
        )
      );
    }

    let jobAppQuery = await db.query(`SELECT * FROM jobs_users WHERE id=$1`, [
      applicationId
    ]);

    let jobApp = jobAppQuery.rows[0];

    if (!jobApp) {
      return next(
        new APIError(
          404,
          'Not Found',
          `No job application with ID ${applicationId} was found.`
        )
      );
    }

    if (
      (req.handle && req.handle !== job.company) ||
      (req.username && req.username !== jobApp.username)
    ) {
      return next(new APIError(404, 'Not Found', 'No job application found.'));
    }
    return res.json(jobApp);
  } catch (err) {
    return next(err);
  }
}

/**
 * Delete a single job application
 */
async function deleteJobApplication(req, res, next) {
  const { jobId, applicationId } = req.params;

  try {
    if (!Number.isSafeInteger(+jobId)) {
      return next(
        new APIError(
          400,
          'Bad Request',
          `Job IDs must consist only of valid integers. '${jobId}' is not a valid integer.`
        )
      );
    }

    let jobQuery = await db.query(`SELECT * FROM jobs WHERE id=$1`, [jobId]);
    let job = jobQuery.rows[0];

    if (!job) {
      return next(
        new APIError(404, 'Not Found', `No job with ID ${jobId} was found.`)
      );
    }

    if (!Number.isSafeInteger(+applicationId)) {
      return next(
        new APIError(
          400,
          'Bad Request',
          `Job Application IDs must consist only of valid integers. '${applicationId}' is not a valid integer.`
        )
      );
    }

    let jobAppQuery = await db.query(`SELECT * FROM jobs_users WHERE id=$1`, [
      applicationId
    ]);

    let jobApp = jobAppQuery.rows[0];
    if (!jobApp) {
      return next(
        new APIError(
          404,
          'Not Found',
          `No job application with ID ${applicationId} was found.`
        )
      );
    }

    if (
      (req.handle && req.handle !== job.company) ||
      (req.username && req.username !== jobApp.username)
    ) {
      return next(new APIError(404, 'Not Found', 'No job application found.'));
    }

    let deleteJobAppQuery = await db.query(
      `DELETE FROM jobs_users WHERE id=$1 RETURNING *`,
      [applicationId]
    );

    return res.json(deleteJobAppQuery.rows[0]);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  applyForJob,
  readJobApplications,
  readJobApplication,
  deleteJobApplication
};
