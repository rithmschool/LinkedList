/**
 * Generate a selective update query based on a request body
 * @param {String} table - where to make the query
 * @param {Object} items - the list of columns you want to update
 * @param {String} key - the column that we query by (e.g. username, handle, id)
 * @param {String} id - current record ID
 * @return {Object} an object containing a DB query as a string, and an array of string values to be updated
 */
function partialUpdate(table, items, key, id) {
  // keep track of item indexes
  // store all the columns we want to update and associate with vals
  let idx = 1;
  let columns = [];
  for (let column in items) {
    columns.push(`${column}=$${idx++}`);
  }

  // build query
  let query =
    `UPDATE ${table} SET ` +
    columns.join(', ') +
    ` WHERE ${key}=$${idx} RETURNING *`;

  let values = Object.values(items);
  values.push(id);

  return { query, values };
}

module.exports = partialUpdate;
