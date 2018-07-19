DROP DATABASE IF EXISTS  "linkedlist_test";
CREATE DATABASE "linkedlist_test";

DROP DATABASE IF EXISTS  "linkedlist";
CREATE DATABASE "linkedlist";
\c "linkedlist"

CREATE TABLE companies
(
  id SERIAL PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  logo TEXT
);

CREATE TABLE jobs
(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  salary TEXT NOT NULL,
  equity FLOAT,
  company TEXT NOT NULL REFERENCES companies(handle) ON DELETE CASCADE
);

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  photo TEXT,
  current_company TEXT REFERENCES companies (handle) ON DELETE SET NULL
);

CREATE TABLE jobs_users
(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs (id) ON DELETE CASCADE
);
\q
