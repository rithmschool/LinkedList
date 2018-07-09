const recursiveSort = require('./recursiveSort');

/**
 * Take response data, add it to the data key of the response object,
 *  and sort the keys
 * @param {Object|Array} data - data for response
 */
function formatResponse(data) {
  // sorting the response object (or array) for readability
  const newData = recursiveSort(data);
  return { data: newData };
}
module.exports = formatResponse;
