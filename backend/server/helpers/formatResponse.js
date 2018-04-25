const recursiveSort = require('./recursiveSort');

function formatResponse(data) {
  // sorting the response object (or array) for readability
  const newData = recursiveSort(data);
  return { data: newData };
}
module.exports = formatResponse;
