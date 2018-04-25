// npm packages
const mongoose = require('mongoose');

// app imports
const { APIError, processDBError } = require('../helpers');

// globals
const { Schema } = mongoose;
const { ObjectId, Decimal128 } = Schema.Types;

const jobSchema = new Schema(
  {
    title: String,
    company: {
      type: ObjectId,
      ref: 'Company'
    },
    applicants: [
      {
        type: ObjectId,
        ref: 'User'
      }
    ],
    salary: Number,
    equity: Decimal128
  },
  { timestamps: true }
);

jobSchema.statics = {
  /**
   * Create a Single New Job
   * @param {object} newJob - an instance of Job
   * @returns {Promise<Job, APIError>}
   */
  async createJob(newJob) {
    try {
      const job = await newJob.save();
      return job.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Delete a single Job
   * @param {String} id - the Job's id
   * @returns {Promise<Job, APIError>}
   */
  async deleteJob(id) {
    try {
      const deleted = await this.findOneAndRemove({ id }).exec();
      if (deleted) {
        return {
          Success: [
            {
              status: 200,
              title: 'Job Deleted.',
              detail: `The job '${id}' was deleted successfully.`
            }
          ]
        };
      }
      throw new APIError(404, 'Job Not Found', `No job '${id}' found.`);
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Get a single Job by id
   * @param {String} id - the Job's id
   * @returns {Promise<Job, APIError>}
   */
  async readJob(id) {
    try {
      const job = await this.findOne({ id }).exec();
      if (job) {
        return job.toObject();
      }
      throw new APIError(404, 'Job Not Found', `No job '${id}' found.`);
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Get a list of Jobs
   * @param {Object} query - pre-formatted query to retrieve jobs.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Jobs, APIError>}
   */
  async readJobs(query, fields, skip, limit) {
    try {
      const jobs = await this.find(query, fields)
        .skip(skip)
        .limit(limit)
        .sort({ id: 1 })
        .exec();
      if (!jobs.length) {
        return [];
      }
      return jobs.map(job => job.toObject());
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Patch/Update a single Job
   * @param {String} id - the Job's id
   * @param {Object} jobUpdate - the json containing the Job attributes
   * @returns {Promise<Job, APIError>}
   */
  async updateJob(id, jobUpdate) {
    try {
      const job = await this.findOneAndUpdate({ id }, jobUpdate, {
        new: true
      }).exec();
      return job.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  }
};

/* Transform with .toObject to remove __v and _id from response */
if (!jobSchema.options.toObject) jobSchema.options.toObject = {};
jobSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

module.exports = mongoose.model('Job', jobSchema);
