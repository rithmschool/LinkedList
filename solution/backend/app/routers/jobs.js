// npm packages
const express = require('express');

// app imports
const { jobsHandler } = require('../handlers');
const { ensureAuth } = require('../middleware');

// globals
const router = new express.Router();
const { readJobs, createJob, readJob, updateJob, deleteJob } = jobsHandler;

/*
  /jobs
*/
router
  .route('')
  .get(ensureAuth, readJobs)
  .post(ensureAuth, createJob);

/*
  /jobs/:id
*/
router
  .route('/:id')
  .get(ensureAuth, readJob)
  .patch(ensureAuth, updateJob)
  .delete(ensureAuth, deleteJob);

module.exports = router;
