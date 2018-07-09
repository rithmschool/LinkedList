// npm packages
const express = require('express');

// app imports
const { jobsHandler } = require('../handlers');

// globals
const router = new express.Router();
const { readJobs, createJob, readJob, updateJob, deleteJob } = jobsHandler;

/*
  /jobs
*/
router
  .route('')
  .get(readJobs)
  .post(createJob);

/*
  /jobs/:id
*/
router
  .route('/:id')
  .get(readJob)
  .patch(updateJob)
  .delete(deleteJob);

module.exports = router;
