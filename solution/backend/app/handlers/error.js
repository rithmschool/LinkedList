const { APIError } = require('../helpers');
const { ENV } = require('../config');

/**
 * Error handler for improperly-formatted request bodies.
 */
function bodyParserHandler(error, req, res, next) {
  if (error instanceof SyntaxError || error instanceof TypeError) {
    // console.error(error);
    return next(new APIError(400, 'Bad Request', 'Malformed JSON.'));
  }
}

/**
 * Better-formatted 404 handler to replace the built-in
 */
function fourOhFourHandler(req, res, next) {
  return next(
    new APIError(
      404,
      'Resource Not Found',
      `${req.path} is not valid path to a LinkedList API resource.`
    )
  );
}

/**
 *  Better-formatted 405 handler to replace the built-in
 */
function fourOhFiveHandler(req, res, next) {
  return next(
    new APIError(
      405,
      'Method Not Allowed',
      `${req.method} method is not supported at ${req.path}.`
    )
  );
}

/**
 * Handle any error in the app. If they aren't APIErrors,
 *  format them into it.
 */
function globalErrorHandler(error, req, res, next) {
  // log the error if we're in development
  if (ENV === 'development') {
    console.log(error);
  }

  // format built-in errors
  if (!(error instanceof APIError)) {
    error = new APIError(500, error.type, error.message);
  }

  return res.status(error.status).json(error);
}

module.exports = {
  bodyParserHandler,
  fourOhFourHandler,
  fourOhFiveHandler,
  globalErrorHandler
};
