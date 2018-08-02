// npm packages
const express = require('express');

// app imports
const { jobsHandler, jobApplicationsHandler } = require('../handlers');
const { ensureAuth } = require('../middleware');

// globals
const router = new express.Router();
const { readJobs, createJob, readJob, updateJob, deleteJob } = jobsHandler;
const {
  applyForJob,
  readJobApplications,
  readJobApplication,
  deleteJobApplication
} = jobApplicationsHandler;

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

/*
  /jobs/:id/applications
*/
router
  .route('/:jobId/applications')
  .get(ensureAuth, readJobApplications)
  .post(ensureAuth, applyForJob);

/*
  /jobs/:jobId/applications/:applicationId
*/
router
  .route('/:jobId/applications/:applicationId')
  .get(ensureAuth, readJobApplication)
  .delete(ensureAuth, deleteJobApplication);

module.exports = router;
