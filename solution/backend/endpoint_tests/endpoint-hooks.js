const hooks = require('hooks');
const { before } = hooks;

before('UserAuth > Auth to Receive Token > Example 1', transaction => {});
// POST (200) /user-auth
before('UserAuth > Auth to Receive Token > Example 2', transaction => {});
// POST (400) /user-auth
before('UserAuth > Auth to Receive Token > Example 3', transaction => {});
// POST (401) /user-auth
before('UserAuth > Auth to Receive Token > Example 4', transaction => {});
// POST (404) /user-auth
before('CompanyAuth > Auth to Receive Token > Example 1', transaction => {});
// POST (200) /company-auth
before('CompanyAuth > Auth to Receive Token > Example 2', transaction => {});
// POST (400) /company-auth
before('CompanyAuth > Auth to Receive Token > Example 3', transaction => {});
// POST (401) /company-auth
before('CompanyAuth > Auth to Receive Token > Example 4', transaction => {});
// POST (404) /company-auth
before('Users > Get a List of Users > Example 1', transaction => {});
// GET (200) /users?skip=0&limit=10&q=Matt%20Lane
before('Users > Get a List of Users > Example 2', transaction => {});
// GET (400) /users?skip=0&limit=10&q=Matt%20Lane
before('Users > Get a List of Users > Example 3', transaction => {});
// GET (401) /users?skip=0&limit=10&q=Matt%20Lane
before('Users > Create a New User > Example 1', transaction => {});
// POST (201) /users?skip=0&limit=10&q=Matt%20Lane
before('Users > Create a New User > Example 2', transaction => {});
// POST (400) /users?skip=0&limit=10&q=Matt%20Lane
before('Users > Create a New User > Example 3', transaction => {});
// POST (409) /users?skip=0&limit=10&q=Matt%20Lane
before('User > Get a User > Example 1', transaction => {});
// GET (200) /users/mhueter
before('User > Get a User > Example 2', transaction => {});
// GET (401) /users/mhueter
before('User > Get a User > Example 3', transaction => {});
// GET (404) /users/mhueter
before('User > Update a User > Example 1', transaction => {});
// PATCH (200) /users/mhueter
before('User > Update a User > Example 2', transaction => {});
// PATCH (400) /users/mhueter
before('User > Update a User > Example 3', transaction => {});
// PATCH (401) /users/mhueter
before('User > Update a User > Example 4', transaction => {});
// PATCH (404) /users/mhueter
before('User > Delete a User > Example 1', transaction => {});
// DELETE (200) /users/mhueter
before('User > Delete a User > Example 2', transaction => {});
// DELETE (401) /users/mhueter
before('User > Delete a User > Example 3', transaction => {});
// DELETE (404) /users/mhueter
before('Jobs > Get a List of Jobs > Example 1', transaction => {});
// GET (200) /jobs?skip=0&limit=50&q=Github
before('Jobs > Get a List of Jobs > Example 2', transaction => {});
// GET (400) /jobs?skip=0&limit=50&q=Github
before('Jobs > Get a List of Jobs > Example 3', transaction => {});
// GET (401) /jobs?skip=0&limit=50&q=Github
before('Jobs > Create a New Job > Example 1', transaction => {});
// POST (201) /jobs?skip=0&limit=50&q=Github
before('Jobs > Create a New Job > Example 2', transaction => {});
// POST (400) /jobs?skip=0&limit=50&q=Github
before('Jobs > Create a New Job > Example 3', transaction => {});
// POST (409) /jobs?skip=0&limit=50&q=Github
before('Job > Get a Job > Example 1', transaction => {});
// GET (200) /jobs/4
before('Job > Get a Job > Example 2', transaction => {});
// GET (401) /jobs/4
before('Job > Get a Job > Example 3', transaction => {});
// GET (404) /jobs/4
before('Job > Update a Job > Example 1', transaction => {});
// PATCH (200) /jobs/4
before('Job > Update a Job > Example 2', transaction => {});
// PATCH (400) /jobs/4
before('Job > Update a Job > Example 3', transaction => {});
// PATCH (401) /jobs/4
before('Job > Update a Job > Example 4', transaction => {});
// PATCH (404) /jobs/4
before('Job > Delete a Job > Example 1', transaction => {});
// DELETE (200) /jobs/4
before('Job > Delete a Job > Example 2', transaction => {});
// DELETE (401) /jobs/4
before('Job > Delete a Job > Example 3', transaction => {});
// DELETE (404) /jobs/4
before('Companies > Get a List of Companies > Example 1', transaction => {});
// GET (200) /companies?skip=0&limit=50&q=Github
before('Companies > Get a List of Companies > Example 2', transaction => {});
// GET (400) /companies?skip=0&limit=50&q=Github
before('Companies > Get a List of Companies > Example 3', transaction => {});
// GET (401) /companies?skip=0&limit=50&q=Github
before('Companies > Create a New Company > Example 1', transaction => {});
// POST (201) /companies?skip=0&limit=50&q=Github
before('Companies > Create a New Company > Example 2', transaction => {});
// POST (400) /companies?skip=0&limit=50&q=Github
before('Companies > Create a New Company > Example 3', transaction => {});
// POST (409) /companies?skip=0&limit=50&q=Github
before('Company > Get a Company > Example 1', transaction => {});
// GET (200) /companies/hooli
before('Company > Get a Company > Example 2', transaction => {});
// GET (401) /companies/hooli
before('Company > Get a Company > Example 3', transaction => {});
// GET (404) /companies/hooli
before('Company > Update a Company > Example 1', transaction => {});
// PATCH (200) /companies/hooli
before('Company > Update a Company > Example 2', transaction => {});
// PATCH (400) /companies/hooli
before('Company > Update a Company > Example 3', transaction => {});
// PATCH (401) /companies/hooli
before('Company > Update a Company > Example 4', transaction => {});
// PATCH (404) /companies/hooli
before('Company > Delete a Company > Example 1', transaction => {});
// DELETE (200) /companies/hooli
before('Company > Delete a Company > Example 2', transaction => {});
// DELETE (401) /companies/hooli
before('Company > Delete a Company > Example 3', transaction => {});
// DELETE (404) /companies/hooli
