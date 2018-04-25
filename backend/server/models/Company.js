// npm packages
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// app imports
const { APIError, processDBError } = require('../helpers');

// globals
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const SALT_WORK_FACTOR = 10;

const companySchema = new Schema(
  {
    name: String,
    handle: {
      type: String,
      index: true,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    password: String,
    logo: String,
    employees: [
      {
        type: ObjectId,
        ref: 'User'
      }
    ],
    jobs: [
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

companySchema.pre('save', async function _hashPassword(next) {
  try {
    const hashed = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

companySchema.statics = {
  /**
   * Create a Single New Company
   * @param {object} newCompany - an instance of Company
   * @returns {Promise<Company, APIError>}
   */
  async createCompany(newCompany) {
    try {
      const model = this;
      const { handle, email } = newCompany;

      const [handleExists, emailExists] = await Promise.all([
        model.findOne({ handle }),
        model.findOne({ email })
      ]);

      if (handleExists) {
        throw new APIError(
          409,
          'Company Already Exists',
          `The handle '${handle}' is taken.`
        );
      } else if (emailExists) {
        throw new APIError(
          409,
          'Email Address Already Registered.',
          `The email address '${email}' has already been registered to a different company.`
        );
      }
      const company = await newCompany.save();
      return company.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Delete a single Company
   * @param {String} handle - the Company's handle
   * @returns {Promise<Company, APIError>}
   */
  async deleteCompany(handle) {
    try {
      const { _id } = await this.findOne({ handle });
      if (!_id) {
        throw new APIError(
          404,
          'Company Not Found',
          `No company '${handle}' found.`
        );
      }
      // clear employee's company IDs
      await mongoose.model('User').bulkClearCompany(_id);
      // remove all jobs matching this company ID
      await mongoose.model('Job').bulkDelete(_id);
      // finally remove the company itself
      await this.findOneAndRemove({ handle }).exec();
      return {
        Success: [
          {
            status: 200,
            title: 'Company Deleted.',
            detail: `The company '${handle}' was deleted successfully.`
          }
        ]
      };
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Get a single Company by handle
   * @param {String} handle - the Company's handle
   * @returns {Promise<Company, APIError>}
   */
  async readCompany(handle) {
    try {
      const company = await this.findOne({ handle })
        .populate('jobs')
        .populate('employees', 'username')
        .exec();

      if (company) {
        return company.toObject();
      }
      throw new APIError(
        404,
        'Company Not Found',
        `No company '${handle}' found.`
      );
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Get a list of Companies
   * @param {Object} query - pre-formatted query to retrieve companies.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Companies, APIError>}
   */
  async readCompanies(query, fields, skip, limit) {
    try {
      const Model = this;
      const [companies, count] = await Promise.all([
        Model.find(query, fields)
          .skip(skip)
          .limit(limit)
          .populate('jobs')
          .populate('employees', 'username')
          .sort({ name: 1 })
          .exec(),
        Model.count(query)
          .skip(skip)
          .limit(limit)
          .exec()
      ]);
      if (count === 0) {
        return { companies, count };
      }
      return { companies: companies.map(company => company.toObject()), count };
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Patch/Update a single Company
   * @param {String} handle - the Company's handle
   * @param {Object} companyUpdate - the json containing the Company attributes
   * @returns {Promise<Company, APIError>}
   */
  async updateCompany(handle, companyUpdate) {
    try {
      if (companyUpdate.password) {
        companyUpdate.password = await bcrypt.hash(
          companyUpdate.password,
          SALT_WORK_FACTOR
        );
      }
      const company = await this.findOneAndUpdate({ handle }, companyUpdate, {
        new: true
      }).exec();
      if (!company) {
        throw new APIError(
          404,
          'Company Not Found',
          `No company with handle '${handle}' found.`
        );
      }
      return company.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },

  /**
   * Add or remove an employee _id to the list of employees on the Company model
   * @param {String} id - the Company _id
   * @param {String} employee - the employee _id
   * @param {String} action - 'add' or 'remove'
   */
  async addOrRemoveEmployee(id, employee, action) {
    try {
      const actions = {
        add: '$addToSet',
        remove: '$pull'
      };

      const company = await this.findByIdAndUpdate(
        id,
        { [actions[action]]: { employees: employee } },
        { new: true }
      );
      return company.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },

  /**
   * Add or remove a job _id to the list of jobs on the Company model
   * @param {String} id - the Company _id
   * @param {String} job - the job _id
   * @param {String} action - 'add' or 'remove'
   */
  async addOrRemoveJob(id, job, action) {
    try {
      const actions = {
        add: '$addToSet',
        remove: '$pull'
      };

      const company = await this.findByIdAndUpdate(
        id,
        { [actions[action]]: { jobs: job } },
        { new: true }
      );
      return company.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  }
};

/* Transform with .toObject to remove __v and _id from response */
if (!companySchema.options.toObject) companySchema.options.toObject = {};
companySchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed.__v;
  delete transformed.password;
  return transformed;
};

module.exports = mongoose.model('Company', companySchema);
