import axios from "axios";

/* This function simply adds a header of Authorization with a value of Bearer + 
the token that has been set. This is very useful for authenticated requests so that 
we don't have to attach the token each time we make a request manually.

If there is a falsey value passed to this function, we delete the header on every future request.
This happens when we log out
*/
export function setTokenHeader(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

/**
 * A wrapper around axios API call that formats errors, etc
 * @param {string} method the HTTP verb you want to use
 * @param {string} path the route path / endpoint
 * @param {object} data (optional) data in JSON form for POST requests
 */

export async function apiCall(method, path, data = {}) {
  try {
    let res = await axios[method](path, data);
    return res.data;
  } catch (err) {
    return Promise.reject(err.response.data.error);
  }
}
