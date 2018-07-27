// npm packages
const express = require('express');

// app imports
const { usersHandler } = require('../handlers');
const { ensureAuth } = require('../middleware');

// globals
const router = new express.Router();
const {
  readUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser
} = usersHandler;

/*
  /users
*/
router
  .route('')
  .get(ensureAuth, readUsers)
  .post(createUser);

/*
  /users/:id
*/
router
  .route('/:username')
  .get(ensureAuth, readUser)
  .patch(ensureAuth, updateUser)
  .delete(ensureAuth, deleteUser);

module.exports = router;
