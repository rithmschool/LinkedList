const { Client } = require('pg');
const { DATABASE_URL } = require('../config');

const client = new Client({
  connectionString: DATABASE_URL
});

console.log(`Connected to database: ${DATABASE_URL}`);
client.connect();

module.exports = client;
