import { FETCH_JOBS, APPLY_TO_JOB } from "../actionTypes";

const DEFAULT_STATE = [];

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case FETCH_JOBS:
      return [...action.jobs];
    case APPLY_TO_JOB:
      // TODO:
      return [...action.jobs];
    default:
      return state;
  }
};
