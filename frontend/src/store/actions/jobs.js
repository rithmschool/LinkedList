import { apiCall } from "../../services/api";
import { FETCH_JOBS, APPLY_TO_JOB } from "../actionTypes";

export function getJobs(jobs) {
  return {
    type: FETCH_JOBS,
    jobs
  };
}

export function fetchJobs() {
  return async dispatch => {
    try {
      let jobs = await apiCall("get", `/jobs`);
      dispatch(getJobs(jobs.data));
      return;
    } catch (err) {
      return Promise.reject(err); // indicate the API call failed
    }
  };
}

export function applyToJob(username, job_id) {
  return async dispatch => {
    try {
      // TODO - make sure this endpoint updates the applied field
      let jobs = await apiCall("patch", `/users/${username}`, {
        data: { applied: [job_id] }
      });
      dispatch(getJobs(jobs.data));
      return;
    } catch (err) {
      return Promise.reject(err); // indicate the API call failed
    }
  };
}
