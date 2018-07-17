// npm packages
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

// app imports
const { ENV } = require('./config');
const { errorHandler, authHandler } = require('./handlers');
const { companiesRouter, jobsRouter, usersRouter } = require('./routers');

// global config
dotenv.config();

const app = express();
const {
  bodyParserHandler,
  globalErrorHandler,
  fourOhFourHandler,
  fourOhFiveHandler
} = errorHandler;

// body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParserHandler); // error handling specific to body parser only

if (ENV === 'development') {
  app.use(morgan('tiny'));
}

// response headers setup; CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'POST,GET,PATCH,DELETE,OPTIONS');
  res.header('Content-Type', 'application/json');
  return next();
});

app.use('/company-auth', authHandler.company);
app.use('/user-auth', authHandler.user);

app.use('/companies', companiesRouter);
app.use('/jobs', jobsRouter);
app.use('/users', usersRouter);

// catch-all for 404 "Not Found" errors
app.get('*', fourOhFourHandler);
// catch-all for 405 "Method Not Allowed" errors
app.all('*', fourOhFiveHandler);

app.use(globalErrorHandler);

module.exports = app;
