import { apiCall } from "../../services/api";
import { FETCH_JOBS, APPLY_TO_JOB, FETCH_USER } from "../actionTypes";

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
      let user = await apiCall("get", `/users/${username}`);
      user.data.applied.push(job_id);

      let job = await apiCall("get", `/jobs/${job_id}`);

      let jobs = await apiCall("patch", `/users/${username}`, {
        data: { applied: user.data.applied }
      });

      dispatch(getJobs(jobs.data));

      return;
    } catch (err) {
      return Promise.reject(err); // indicate the API call failed
    }
  };
}
