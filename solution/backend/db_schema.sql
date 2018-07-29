DROP DATABASE IF EXISTS  "linkedlist_test";
CREATE DATABASE "linkedlist_test";

DROP DATABASE IF EXISTS  "linkedlist";
CREATE DATABASE "linkedlist";
\c "linkedlist"

CREATE TABLE companies
(
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  logo TEXT,
  name TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE jobs
(
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL REFERENCES companies(handle) ON DELETE CASCADE,
  equity FLOAT,
  salary TEXT NOT NULL,
  title TEXT NOT NULL
);

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  current_company TEXT REFERENCES companies (handle) ON DELETE SET NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  password TEXT NOT NULL,
  photo TEXT,
  username TEXT UNIQUE NOT NULL UNIQUE
);

CREATE TABLE jobs_users
(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs (id) ON DELETE CASCADE
);

\q
