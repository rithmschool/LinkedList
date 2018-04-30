import { apiCall } from "../../services/api";
import { FETCH_USER } from "../actionTypes";

function getUser(user) {
  return {
    type: FETCH_USER,
    user
  };
}

export function fetchUser(username) {
  return async dispatch => {
    try {
      let user = await apiCall("get", `/users/${username}`);
      dispatch(getUser(user.data));
      return;
    } catch (err) {
      return Promise.reject(err); // indicate the API call failed
    }
  };
}

export function editUser(username, data) {
  return async dispatch => {
    try {
      let user = await apiCall("patch", `/users/${username}`, { data });
      dispatch(getUser(user.data));
      return;
    } catch (err) {
      return Promise.reject(err); // indicate the API call failed
    }
  };
}
