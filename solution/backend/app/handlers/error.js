const { APIError } = require('../helpers');

function bodyParserHandler(error, request, response, next) {
  if (error instanceof SyntaxError || error instanceof TypeError) {
    // console.error(error);
    return next(new APIError(400, 'Bad Request', 'Malformed JSON.'));
  }
}

function fourOhFourHandler(request, response, next) {
  return next(
    new APIError(
      404,
      'Resource Not Found',
      `${request.path} is not valid path to a LinkedList API resource.`
    )
  );
}

function fourOhFiveHandler(request, response, next) {
  return next(
    new APIError(
      405,
      'Method Not Allowed',
      `${request.method} method is not supported at ${request.path}.`
    )
  );
}

function globalErrorHandler(error, request, response, next) {
  // format built-in errors
  if (!(error instanceof APIError)) {
    error = new APIError(500, error.type, error.message);
  }
  // log the error stack if we're in development
  process.env.NODE_ENV === 'development' && console.error(error.stack); //eslint-disable-line no-console

  return response.status(error.status).json(error);
}

module.exports = {
  bodyParserHandler,
  fourOhFourHandler,
  fourOhFiveHandler,
  globalErrorHandler
};
