// npm packages
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// app imports
const app = require('../../app');
const db = require('../../db');

// Database DDL (for tests)
const db_tables = {
  companies: `CREATE TABLE companies
  (
    id SERIAL PRIMARY KEY,
    handle TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
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
    company TEXT REFERENCES companies (handle) ON DELETE SET NULL
  )`,
  jobs: `CREATE TABLE jobs
(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  salary TEXT NOT NULL,
  equity FLOAT,
  company TEXT NOT NULL REFERENCES companies(handle) ON DELETE CASCADE
)`,
  jobs_users: `CREATE TABLE jobs_users
(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs (id) ON DELETE CASCADE
)`
};

async function beforeAllHook() {
  for (let table in db_tables) {
    await db.query(db_tables[table]);
  }
}

/**
 * Hooks to insert a user, company, and job, and to authenticate
 *  the user and the company for respective tokens that are stored
 *  in the input `auth` parameter.
 * @param {Object} auth - build the auth object
 */
async function beforeEachHook(auth) {
  // login a user, get a token, store the user ID and token
  const hashedPassword = await bcrypt.hash('secret', 1);
  await db.query("INSERT INTO users (username, password) VALUES ('test', $1)", [
    hashedPassword
  ]);

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
    "INSERT INTO companies (handle, password) VALUES ('testcompany', $1)",
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
}

async function afterEachHook() {
  for (let table in db_tables) {
    await db.query(`DELETE FROM ${table}`);
  }
}

async function afterAllHook() {
  for (let table in db_tables) {
    await db.query(`DROP TABLE IF EXISTS ${table}`);
  }
  await db.end();
}

module.exports = {
  afterEachHook,
  afterAllHook,
  beforeAllHook,
  beforeEachHook,
  db_tables
};
