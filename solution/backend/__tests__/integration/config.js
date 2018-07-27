// npm packages
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// app imports
const app = require('../../app/app');
const db = require('../../app/db');

// Database DDL (for tests)
const db_tables = {
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
const auth = {};

async function beforeAllHook() {
  try {
    await db.query(db_tables['companies']);
    await db.query(db_tables['users']);
    await db.query(db_tables['jobs']);
    await db.query(db_tables['jobs_users']);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Hooks to insert a user, company, and job, and to authenticate
 *  the user and the company for respective tokens that are stored
 *  in the input `auth` parameter.
 * @param {Object} auth - build the auth object
 */
async function beforeEachHook(auth) {
  try {
    // login a user, get a token, store the user ID and token
    const hashedPassword = await bcrypt.hash('secret', 1);
    await db.query(
      "INSERT INTO users (username, password, first_name, last_name) VALUES ('test', $1, 'tester', 'mctest')",
      [hashedPassword]
    );

    const response = await request(app)
      .post('/user-auth')
      .send({
        username: 'test',
        password: 'secret'
      });

    auth.user_token = response.body.token;
    auth.current_username = jwt.decode(auth.user_token).username;

    // do the same for company "companies"
    const hashedCompanyPassword = await bcrypt.hash('secret', 1);
    await db.query(
      "INSERT INTO companies (handle, password, name, email) VALUES ('testcompany', $1, 'Test Company', 'test@rithmschool.com')",
      [hashedCompanyPassword]
    );

    const companyResponse = await request(app)
      .post('/company-auth')
      .send({
        handle: 'testcompany',
        password: 'secret'
      });

    auth.company_token = companyResponse.body.token;
    auth.current_company_handle = jwt.decode(auth.company_token).handle;

    await db.query(
      "INSERT INTO jobs (title, salary, company) VALUES ('Software Engineer', 'TBD', $1)",
      [auth.current_company_handle]
    );
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
  auth,
  beforeAllHook,
  beforeEachHook,
  db_tables
};
