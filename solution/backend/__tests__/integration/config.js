// npm packages
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// app imports
const app = require('../../app/app');
const db = require('../../app/db');

// Database DDL (for tests)
const DB_TABLES = {
  companies: `CREATE TABLE companies
  (
    id SERIAL PRIMARY KEY,
    handle TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    logo TEXT
  )`,
  users: `CREATE TABLE users
  (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    photo TEXT,
    current_company TEXT REFERENCES companies (handle) ON DELETE SET NULL
  )`,
  jobs: `CREATE TABLE jobs
(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  salary TEXT NOT NULL,
  equity FLOAT,
  company TEXT NOT NULL REFERENCES companies (handle) ON DELETE CASCADE
)`,
  jobs_users: `CREATE TABLE jobs_users
(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs (id) ON DELETE CASCADE
)`
};

// global auth variable to store things for all the tests
const TEST_DATA = {};

async function beforeAllHook() {
  try {
    await db.query(DB_TABLES['companies']);
    await db.query(DB_TABLES['users']);
    await db.query(DB_TABLES['jobs']);
    await db.query(DB_TABLES['jobs_users']);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Hooks to insert a user, company, and job, and to authenticate
 *  the user and the company for respective tokens that are stored
 *  in the input `testData` parameter.
 * @param {Object} TEST_DATA - build the TEST_DATA object
 */
async function beforeEachHook(TEST_DATA) {
  try {
    // login a user, get a token, store the user ID and token
    const hashedPassword = await bcrypt.hash('secret', 1);
    await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email)
                  VALUES ('test', $1, 'tester', 'mctest', 'test@rithmschool.com')`,
      [hashedPassword]
    );

    const response = await request(app)
      .post('/user-auth')
      .send({
        username: 'test',
        password: 'secret'
      });

    TEST_DATA.userToken = response.body.token;
    TEST_DATA.currentUsername = jwt.decode(TEST_DATA.userToken).username;

    // do the same for company "companies"
    const hashedCompanyPassword = await bcrypt.hash('secret', 1);
    await db.query(
      "INSERT INTO companies (handle, password, name, email) VALUES ('testcompany', $1, 'Test Company', 'testcompany@rithmschool.com')",
      [hashedCompanyPassword]
    );

    const companyResponse = await request(app)
      .post('/company-auth')
      .send({
        handle: 'testcompany',
        password: 'secret'
      });

    TEST_DATA.companyToken = companyResponse.body.token;
    TEST_DATA.currentCompanyHandle = jwt.decode(TEST_DATA.companyToken).handle;

    const newJob = await db.query(
      "INSERT INTO jobs (title, salary, company) VALUES ('Software Engineer', 'TBD', $1) RETURNING *",
      [TEST_DATA.currentCompanyHandle]
    );
    TEST_DATA.jobId = newJob.rows[0].id;
  } catch (error) {
    console.error(error);
  }
}

async function afterEachHook() {
  try {
    await db.query('DELETE FROM jobs_users');
    await db.query('DELETE FROM jobs');
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM companies');
  } catch (error) {
    console.error(error);
  }
}

async function afterAllHook() {
  try {
    await db.query('DROP TABLE IF EXISTS jobs_users');
    await db.query('DROP TABLE IF EXISTS jobs');
    await db.query('DROP TABLE IF EXISTS users');
    await db.query('DROP TABLE IF EXISTS companies');
    await db.end();
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  afterAllHook,
  afterEachHook,
  TEST_DATA,
  beforeAllHook,
  beforeEachHook,
  DB_TABLES
};
