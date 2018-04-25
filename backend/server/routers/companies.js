// npm packages
const express = require('express');

// app imports
const { companiesHandler } = require('../handlers');

// globals
const router = new express.Router();
const {
  readCompanies,
  createCompany,
  readCompany,
  updateCompany,
  deleteCompany
} = companiesHandler;

/* All the Companies Route */
router
  .route('')
  .get(readCompanies)
  .post(createCompany);

/* Single Company by Handle Route */
router
  .route('/:handle')
  .get(readCompany)
  .patch(updateCompany)
  .delete(deleteCompany);

module.exports = router;
