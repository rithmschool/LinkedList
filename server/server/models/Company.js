// npm packages
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

// app imports
const { APIError, processDBError } = require('../helpers');

// globals
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const companySchema = new Schema(
  {
    id: {
      type: String,
      index: true,
      unique: true
    },
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
    employees: [String],
    jobs: [
      {
        type: ObjectId,
        ref: 'Job'
      }
    ]
  },
  { timestamps: true }
);

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
      newCompany.id = uuidv4();
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
      const deleted = await this.findOneAndRemove({ handle }).exec();
      if (deleted) {
        return {
          Success: [
            {
              status: 200,
              title: 'Company Deleted.',
              detail: `The company '${handle}' was deleted successfully.`
            }
          ]
        };
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
   * Get a single Company by handle
   * @param {String} handle - the Company's handle
   * @returns {Promise<Company, APIError>}
   */
  async readCompany(handle) {
    try {
      const company = await this.findOne({ handle }).exec();

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
      const companies = await this.find(query, fields)
        .skip(skip)
        .limit(limit)
        .sort({ handle: 1 })
        .exec();
      if (!companies.length) {
        return [];
      }
      return companies.map(company => company.toObject());
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
      const company = await this.findOneAndUpdate({ handle }, companyUpdate, {
        new: true
      }).exec();
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
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

module.exports = mongoose.model('Company', companySchema);
