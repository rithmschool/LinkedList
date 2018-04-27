// npm packages
const mongoose = require('mongoose');

// app imports
const { APIError, processDBError } = require('../helpers');

// globals
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

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
    equity: Number
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
      await mongoose
        .model('Company')
        .addOrRemoveJob(job.company, job._id, 'add');
      return job.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Delete all jobs belonging to a company. Used when you delete
   *  a company
   * @param {String} company - company ID for all the jobs to delete
   */
  async bulkDelete(company) {
    try {
      await this.remove({ company });
      return {
        Success: [
          {
            status: 200,
            title: 'Jobs Deleted.',
            detail: `The jobs belonging to company '${company}' were deleted successfully.`
          }
        ]
      };
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
      const deleted = await this.findByIdAndRemove(id).exec();
      await mongoose
        .model('Company')
        .addOrRemoveJob(deleted.company, deleted._id, 'remove');
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
      const job = await this.findById(id)
        .populate('company', 'handle')
        .exec();
      if (job) {
        return job.toObject();
      }
      throw new APIError(404, 'Job Not Found', `No job '${id}' found.`);
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Search for Jobs using MongoDB text index
   * @param {String} searchText - req.query
   * @param {Number} skip - number of docs to skip (for pagination)
   * @param {Number} limit - number of docs to limit result to
   */
  async searchJobs(searchText, skip, limit) {
    const Model = this;
    try {
      const searchQuery = { $text: { $search: searchText } };
      const [jobs, count] = await Promise.all([
        Model.find(searchQuery, { score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(limit)
          .populate('company', 'handle')
          .sort({ score: { $meta: 'textScore' } })
          .exec(),
        Model.count(searchQuery).exec()
      ]);

      if (count === 0) {
        return { jobs, count };
      }
      return { jobs: jobs.map(job => job.toObject()), count };
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
      const Model = this;
      const [jobs, count] = await Promise.all([
        Model.find(query, fields)
          .skip(skip)
          .limit(limit)
          .populate('company', 'handle')
          .sort({ updatedAt: -1 })
          .exec(),
        Model.count(query).exec()
      ]);
      if (count === 0) {
        return { jobs, count };
      }
      return { jobs: jobs.map(job => job.toObject()), count };
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
      const job = await this.findByIdAndUpdate(id, jobUpdate, {
        new: true
      }).exec();

      if (!job) {
        throw new APIError(
          404,
          'Job Not Found',
          `No job with ID '${id}' found.`
        );
      }
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
  delete transformed.__v;
  return transformed;
};

jobSchema.index({ title: 'text' });
module.exports = mongoose.model('Job', jobSchema);
