// npm packages
const { validate } = require('jsonschema');

// app imports
const db = require('../db');
const { APIError, processOffsetLimit } = require('../helpers');
const { userNewSchema, userUpdateSchema } = require('../schemas');

/**
 * List all the users. Query params ?offset=0&limit=1000 by default
 */
async function readUsers(req, res, next) {
  /* pagination validation */
  let { offset, limit } = processOffsetLimit(req.query.offset, req.query.limit);
  if (offset && typeof offset !== 'number') {
    return next(offset);
  } else if (limit && typeof limit !== 'number') {
    return next(limit);
  }

  try {
    let query = 'SELECT * FROM users';
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    const results = await db.query(query);
    const users = results.rows;
    return res.json(users);
  } catch (err) {
    return next(err);
  }
}

/**
 * Validate the POST req body and create a new User
 */
async function createUser(req, res, next) {
  const validation = validate(req.body, userNewSchema);
  if (!validation.valid) {
    return next(validation.errors);
  }

  const {
    firstName,
    lastName,
    email,
    photo,
    company_id,
    username,
    password
  } = req.body.data;

  try {
    const result = await db.query(
      'INSERT INTO users (first_name, last_name, email, photo, company_id, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [firstName, lastName, email, photo, company_id, username, password]
    );
    const newUser = result.rows[0];
    return res.json(newUser);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single user
 * @param {String} id - the id of the User to retrieve
 */
async function readUser(req, res, next) {
  const { username } = req.params;

  try {
    const result = await db.query('SELECT * FROM users WHERE id=$1', [id]);
    const jobs = await db.query(
      'SELECT job_id FROM jobs_users WHERE user_id=$1',
      [id]
    );
    const user = result.rows[0];
    if (!user) {
      return next(
        new APIError(404, 'User Not Found', `No User with ID ${id} found.`)
      );
    }
    user.jobs = jobs.rows.map(job => job.id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single user
 * @param {String} id - the id of the User to update
 */
async function updateUser(req, res, next) {
  const { username } = req.params;

  const validation = validate(req.body, userUpdateSchema);
  if (!validation.valid) {
    return next(validation.errors);
  }

  const {
    firstName,
    lastName,
    email,
    photo,
    company_id,
    username,
    password
  } = req.body.data;

  try {
    const result = await db.query(
      'UPDATE users SET first_name=($1), last_name=($2), email=($3), photo=($4),company_id=($5),username=($6),password=($7) WHERE id=($8) RETURNING *',
      [firstName, lastName, email, photo, company_id, username, password, id]
    );

    const updatedUser = result.rows[0];
    if (!updatedUser) {
      return next(
        new APIError(404, 'User Not Found', `No User with ID ${id} found.`)
      );
    }

    return res.json(updatedUser);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single user
 * @param {String} id - the id of the User to remove
 */
async function deleteUser(req, res, next) {
  const { username } = req.params;

  try {
    const result = await db.query('DELETE FROM users WHERE id=$1', [id]);
    const deletedUser = result.rows[0];
    return res.json(deletedUser);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createUser,
  readUser,
  readUsers,
  updateUser,
  deleteUser
};
