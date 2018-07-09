DROP DATABASE IF EXISTS  "linkedlist";
CREATE DATABASE "linkedlist";
\c "linkedlist"

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name TEXT,
    logo TEXT,
    handle TEXT,
    password TEXT
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title TEXT,
    salary TEXT,
    equity FLOAT,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    photo TEXT,
    username TEXT,
    password TEXT,
    company_id INTEGER REFERENCES companies (id) ON DELETE SET NULL
);

CREATE TABLE jobs_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    job_ib INTEGER REFERENCES companies (id) ON DELETE CASCADE
);
\q
