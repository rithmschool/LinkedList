const APIError = require('./APIError');

/**
 * Validate the 'offset' and `limit` query params
 * @param {String} offset - the offset query key
 * @param {String} limit - the limit query key
 * @return {Object} an object containing a limit and offset key
 */
function processOffsetLimit(offset, limit) {
  offset = validateNum(offset);
  limit = validateNum(limit);

  // default offset is 0 and default limit is 50
  return { offset: offset || 0, limit: limit || 50 };
}

/**
 * Validate a number value within a min and max
 * @param {String} val - limit or offset param
 * @param {Number} max - the max value (default 1000)
 * @param {String} type - what we're validating (offset or limit, default limit)
 * @return {Number} numerical form of the val
 */
function validateNum(val, max = 1000, type = 'limit') {
  if (val === undefined) {
    return null;
  }
  const min = type === 'offset' ? 0 : 1;
  const num = +val;

  if (!Number.isInteger(num)) {
    return new APIError(
      400,
      'Bad Request',
      `Invalid ${type}: '${val}', ${type} needs to be an integer.`
    );
  } else if (num < min || (max && num > max)) {
    return new APIError(
      400,
      'Bad Request',
      `${num} is out of range for ${type} -- it should be between ${min} and ${max}.`
    );
  }

  return num;
}

module.exports = processOffsetLimit;
