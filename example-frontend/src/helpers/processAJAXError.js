/**
 * Handle and format errors from axios
 *   based on: https://github.com/axios/axios#handling-errors
 * @param {Object} error - an axios error object
 * @return {Object} error - a formatted error object
 */
function processAJAXError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, message, title } = error.response.data;
    return { status, message, title };
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return error.request;
  }
  // Something happened in setting up the request that triggered an Error
  return error;
}

export default processAJAXError;