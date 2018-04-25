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

/* All the Users Route */
router
  .route('')
  .get(readUsers)
  .post(createUser);

/* Single User by Username Route */
router
  .route('/:username')
  .get(readUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
