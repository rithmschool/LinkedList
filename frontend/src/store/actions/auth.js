import { apiCall, setTokenHeader } from "../../services/api";
import { addError, removeError } from "./errors";
import { SET_CURRENT_USER } from "../actionTypes";

export function setAuthorizationToken(token) {
  setTokenHeader(token);
}
/**
 * Sign up or Sign in a user
 * @param {string} type signin or signup user
 * @param {object} userData JSON object from form
 */
export function authUser(type, data) {
  return async dispatch => {
    try {
      let newUser = await apiCall("post", `/users`, { data });
      let authData = await apiCall("post", `/user-auth`, { data });
      // once we have logged in, set a token in localStorage
      localStorage.setItem("jwtToken", authData.data.token);
      // set a header of Authorization
      setAuthorizationToken(authData.data.token);
      // set a currentUser in Redux
      dispatch(setCurrentUser({ username: newUser.username }));
      // remove any error messages
      dispatch(removeError());
      return;
    } catch (err) {
      dispatch(addError(err.message));
      return Promise.reject(err); // indicate the API call failed
    }
  };
}

export function loginUser(type, data) {
  return async dispatch => {
    try {
      let authData = await apiCall("post", `/user-auth`, { data });
      // once we have logged in, set a token in localStorage
      localStorage.setItem("jwtToken", authData.data.token);
      // set a header of Authorization
      setAuthorizationToken(authData.data.token);
      // set a currentUser in Redux
      dispatch(setCurrentUser({ username: data.username }));
      // remove any error messages
      dispatch(removeError());
      return;
    } catch (err) {
      dispatch(addError(err.message));
      return Promise.reject(err); // indicate the API call failed
    }
  };
}

export function logout() {
  // we need to make this a thunk so that we can dispatch setCurrentUser
  return dispatch => {
    // clear the token from localStorage
    localStorage.clear();
    // remove the Authorization header
    setAuthorizationToken(false);
    // set the currentUser to be {} in Redux
    dispatch(setCurrentUser({}));
  };
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}
