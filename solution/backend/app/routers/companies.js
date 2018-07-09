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

/*
  /companies
*/
router
  .route('')
  .get(readCompanies)
  .post(createCompany);

/*
  /companies/:id
*/
router
  .route('/:id')
  .get(readCompany)
  .patch(updateCompany)
  .delete(deleteCompany);

module.exports = router;
