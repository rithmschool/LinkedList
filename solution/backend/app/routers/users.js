// npm packages
const express = require('express');

// app imports
const { usersHandler } = require('../handlers');

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
  .get(readUsers)
  .post(createUser);

/*
  /users/:id
*/
router
  .route('/:id')
  .get(readUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
