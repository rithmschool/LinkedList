import { combineReducers } from "redux";
import currentUser from "./currentUser";
import errors from "./errors";
import jobs from "./jobs";
import user from "./user";

const rootReducer = combineReducers({
  currentUser,
  errors,
  jobs,
  user
});

export default rootReducer;
