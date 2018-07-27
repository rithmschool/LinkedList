// npm packages
const express = require('express');

// app imports
const { companiesHandler } = require('../handlers');
const { ensureAuth } = require('../middleware');

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
  .get(ensureAuth, readCompanies)
  .post(createCompany);

/*
  /companies/:id
*/
router
  .route('/:handle')
  .get(ensureAuth, readCompany)
  .patch(ensureAuth, updateCompany)
  .delete(ensureAuth, deleteCompany);

module.exports = router;
