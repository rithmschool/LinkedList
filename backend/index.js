const startServer = require('./server');

try {
  startServer();
} catch (err) {
  console.error(err); // eslint-disable-line no-console
  process.exit(1);
}
