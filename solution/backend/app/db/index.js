const { Client } = require('pg');
const { POSTGRESQL_URI } = require('../config');
const client = new Client({
  connectionString: POSTGRESQL_URI
});

client.connect();

module.exports = client;
