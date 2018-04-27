// npm packages
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
Promise = require('bluebird'); // eslint-disable-line

// app imports
const { ENV, PORT, MONGODB_URI } = require('./config');
const {
  errorHandler,
  companyAuthHandler,
  userAuthHandler
} = require('./handlers');
const { companiesRouter, jobsRouter, usersRouter } = require('./routers');

// global config
dotenv.config();
// database
mongoose.Promise = Promise;
if (ENV === 'development') {
  mongoose.set('debug', true);
}

async function startServer() {
  const app = express();
  const {
    bodyParserHandler,
    globalErrorHandler,
    fourOhFourHandler,
    fourOhFiveHandler
  } = errorHandler;

  /* eslint-disable no-console */

  // body parser setup
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ type: '*/*' }));
  app.use(bodyParserHandler); // error handling specific to body parser only

  if (ENV === 'development') {
    app.use(morgan('tiny'));
  }

  // response headers setup; CORS
  app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
      'Access-Control-Allow-Headers',
      'Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
    );
    response.header(
      'Access-Control-Allow-Methods',
      'POST,GET,PATCH,DELETE,OPTIONS'
    );
    response.header('Content-Type', 'application/json');
    return next();
  });

  app.use('/company-auth', companyAuthHandler);
  app.use('/user-auth', userAuthHandler);

  app.use('/companies', companiesRouter);
  app.use('/jobs', jobsRouter);
  app.use('/users', usersRouter);

  // catch-all for 404 "Not Found" errors
  app.get('*', fourOhFourHandler);
  // catch-all for 405 "Method Not Allowed" errors
  app.all('*', fourOhFiveHandler);

  app.use(globalErrorHandler);

  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: ENV === 'development'
    });
    console.log('Connected to database');
    return app.listen(PORT, () => {
      console.log(
        `LinkedList API express server is listening on port ${PORT}...`
      );
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = startServer;
