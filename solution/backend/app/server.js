const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, () => {
  console.log(`LinkedList server is listening on port ${PORT}...`);
});
