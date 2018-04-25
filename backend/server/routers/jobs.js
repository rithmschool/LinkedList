// npm packages
const express = require('express');

// app imports
const { jobsHandler } = require('../handlers');

// globals
const router = new express.Router();
const { readJobs, createJob, readJob, updateJob, deleteJob } = jobsHandler;

/* All the Jobs Route */
router
  .route('')
  .get(readJobs)
  .post(createJob);

/* Single Job by ID Route */
router
  .route('/:id')
  .get(readJob)
  .patch(updateJob)
  .delete(deleteJob);

module.exports = router;
