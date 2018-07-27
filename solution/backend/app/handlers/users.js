// npm packages
const bcrypt = require('bcrypt');
const { validate } = require('jsonschema');

// app imports
const db = require('../db');
const { APIError, processOffsetLimit, partialUpdate } = require('../helpers');
const { userNewSchema, userUpdateSchema } = require('../schemas');
const { SALT_FACTOR } = require('../config');

/**
 * List all the users. Query params ?offset=0&limit=1000 by default
 */
async function readUsers(req, res, next) {
  /* pagination validation */
  let { offset, limit } = processOffsetLimit(req.query.offset, req.query.limit);
  if (offset && offset instanceof APIError) {
    return next(offset);
  } else if (limit && limit instanceof APIError) {
    return next(limit);
  }

  try {
    let query, results;
    const { search } = req.query;

    if (search) {
      query = `SELECT first_name, last_name, email, photo, current_company, username FROM users
                WHERE concat_ws(' ', first_name, last_name) ILIKE $1
                  OR username ILIKE $1 LIMIT $2 OFFSET $3`;
      results = await db.query(query, [`%${search}%`, limit, offset]);
    } else {
      query = `SELECT first_name, last_name, email, photo, current_company, username
      FROM users LIMIT $1 OFFSET $2`;
      results = await db.query(query, [limit, offset]);
    }

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
    return next(
      new APIError(
        400,
        'Bad Request',
        validation.errors.map(e => e.stack).join('. ')
      )
    );
  }

  const {
    first_name,
    last_name,
    email,
    photo,
    current_company,
    username,
    password
  } = req.body;

  const duplicateCheck = await db.query(
    'SELECT * FROM users WHERE username=$1',
    [username]
  );

  if (duplicateCheck.rows[0]) {
    return next(
      new APIError(
        409,
        'Conflict',
        `There already exists a user with username '${username}'.`
      )
    );
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, SALT_FACTOR);

  try {
    const result = await db.query(
      `INSERT INTO users (first_name, last_name, email, photo, current_company, username, password)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING first_name, last_name, email, photo, current_company, username`,
      [
        first_name,
        last_name,
        email,
        photo,
        current_company,
        username,
        hashedPassword
      ]
    );
    const newUser = result.rows[0];
    return res.status(201).json(newUser);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single user
 * @param {String} username - the username of the User to retrieve
 */
async function readUser(req, res, next) {
  const { username } = req.params;

  try {
    const result = await db.query(
      'SELECT first_name, last_name, email, photo, current_company, username FROM users WHERE username=$1',
      [username]
    );
    const jobs = await db.query(
      'SELECT job_id FROM jobs_users WHERE username=$1',
      [username]
    );
    const user = result.rows[0];
    if (!user) {
      return next(
        new APIError(
          404,
          'User Not Found',
          `No User with username '${username}' found.`
        )
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
 * @param {String} username - the username of the User to update
 */
async function updateUser(req, res, next) {
  const { username } = req.params;

  if (!req.username || req.username !== username) {
    return next(
      new APIError(403, 'Forbidden', 'You are not allowed to edit this user.')
    );
  }

  const validation = validate(req.body, userUpdateSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        'Bad Request',
        validation.errors.map(e => e.stack).join('. ')
      )
    );
  }

  try {
    // see if the user is changing their password
    let updateFields = { ...req.body };
    if (updateFields.password) {
      updateFields.password = await bcrypt.hash(
        updateFields.password,
        SALT_FACTOR
      );
    }
    // apply partial update to get a query and values for the query
    let { query, values } = partialUpdate(
      'users',
      updateFields,
      'username',
      username
    );
    const result = await db.query(query, values);

    const updatedUser = result.rows[0];
    if (!updatedUser) {
      return next(
        new APIError(
          404,
          'User Not Found',
          `No User with username '${username}' found.`
        )
      );
    }
    delete updatedUser.password;

    return res.json(updatedUser);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single user
 * @param {String} username - the username of the User to remove
 */
async function deleteUser(req, res, next) {
  const { username } = req.params;

  if (!req.username || req.username !== username) {
    return next(
      new APIError(403, 'Forbidden', 'You are not allowed to delete this user.')
    );
  }

  try {
    const result = await db.query(
      'DELETE FROM users WHERE username=$1 RETURNING *',
      [username]
    );
    const deletedUser = result.rows[0];
    if (!deletedUser) {
      return next(
        new APIError(
          404,
          'User Not Found',
          `No User with username '${username}' found.`
        )
      );
    }
    delete deletedUser.password;
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
