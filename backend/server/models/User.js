// npm packages
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// app imports
const { APIError, processDBError } = require('../helpers');

// globals
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    username: {
      type: String,
      index: true,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    password: String,
    currentCompanyName: String,
    currentCompanyId: {
      type: ObjectId,
      ref: 'Company'
    },
    photo: String,
    experience: [
      {
        jobTitle: String,
        companyName: String,
        companyId: {
          type: ObjectId,
          ref: 'Company'
        },
        startDate: Date,
        endDate: Date,
        _id: false
      }
    ],
    education: {
      institution: String,
      degree: String,
      endDate: Date,
      _id: false
    },
    skills: [String],
    applied: [
      {
        type: ObjectId,
        ref: 'Job'
      }
    ]
  },
  { timestamps: true }
);

/**
 * A wrapper around bcrypt password hashing
 * @param {function} next callback to next Mongoose middleware
 */

userSchema.pre('save', async function _hashPassword(next) {
  try {
    const hashed = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.statics = {
  /**
   * Create a Single New User
   * @param {object} newUser - an instance of User
   * @returns {Promise<User, APIError>}
   */
  async createUser(newUser) {
    try {
      const model = this;
      const { username, email } = newUser;

      const [usernameExists, emailExists] = await Promise.all([
        model.findOne({ username }),
        model.findOne({ email })
      ]);

      if (usernameExists) {
        throw new APIError(
          409,
          'User Already Exists',
          `The username '${username}' is taken.`
        );
      } else if (emailExists) {
        throw new APIError(
          409,
          'Email Address Already Registered.',
          `The email address '${email}' has already been registered to a different user.`
        );
      }
      const user = await newUser.save();

      return user.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Delete a single User
   * @param {String} username - the User's username
   * @returns {Promise<User, APIError>}
   */
  async deleteUser(username) {
    try {
      const deleted = await this.findOneAndRemove({ username }).exec();
      if (deleted) {
        return {
          Success: [
            {
              status: 200,
              title: 'User Deleted.',
              detail: `The user '${username}' was deleted successfully.`
            }
          ]
        };
      }
      throw new APIError(404, 'User Not Found', `No user '${username}' found.`);
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Get a single User by username
   * @param {String} username - the User's username
   * @returns {Promise<User, APIError>}
   */
  async readUser(username) {
    try {
      const user = await this.findOne({ username }).exec();

      if (user) {
        return user.toObject();
      }
      throw new APIError(404, 'User Not Found', `No user '${username}' found.`);
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Get a list of Users
   * @param {Object} query - pre-formatted query to retrieve users.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Users, APIError>}
   */
  async readUsers(query, fields, skip, limit) {
    try {
      const users = await this.find(query, fields)
        .skip(skip)
        .limit(limit)
        .sort({ username: 1 })
        .exec();
      if (!users.length) {
        return [];
      }
      return users.map(user => user.toObject());
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Patch/Update a single User
   * @param {String} username - the User's username
   * @param {Object} userUpdate - the json containing the User attributes
   * @returns {Promise<User, APIError>}
   */
  async updateUser(username, userUpdate) {
    if (userUpdate.password) {
      userUpdate.password = await bcrypt.hash(
        userUpdate.password,
        SALT_WORK_FACTOR
      );
    }
    try {
      const user = await this.findOneAndUpdate({ username }, userUpdate, {
        new: true
      }).exec();
      return user.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  }
};

/* Transform with .toObject to remove __v and _id from response */
if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed.__v;
  delete transformed.password;
  return transformed;
};

module.exports = mongoose.model('User', userSchema);
