// npm packages
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

// app imports
const { APIError, processDBError } = require('../helpers');

// globals
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

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
      newUser.id =
      const user = await newUser.save();
      return user.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Delete a single User
   * @param {String} name - the User's name
   * @returns {Promise<User, APIError>}
   */
  async deleteUser(name) {
    try {
      const deleted = await this.findOneAndRemove({ name }).exec();
      if (deleted) {
        return {
          Success: [
            {
              status: 200,
              title: 'User Deleted.',
              detail: `The user '${name}' was deleted successfully.`
            }
          ]
        };
      }
      throw new APIError(404, 'User Not Found', `No user '${name}' found.`);
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Get a single User by name
   * @param {String} name - the User's name
   * @returns {Promise<User, APIError>}
   */
  async readUser(name) {
    try {
      const user = await this.findOne({ name }).exec();

      if (user) {
        return user.toObject();
      }
      throw new APIError(404, 'User Not Found', `No user '${name}' found.`);
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
        .sort({ name: 1 })
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
   * @param {String} name - the User's name
   * @param {Object} userUpdate - the json containing the User attributes
   * @returns {Promise<User, APIError>}
   */
  async updateUser(name, userUpdate) {
    try {
      const user = await this.findOneAndUpdate({ name }, userUpdate, {
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
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

/** Ensure MongoDB Indices **/
userSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model('User', userSchema);
