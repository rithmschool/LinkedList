const { errorHandler } = require('../../app/handlers');
const { APIError } = require('../../app/helpers');

const { globalErrorHandler } = errorHandler;

describe('Global Error Handler', () => {
  test('Handles non-API Errors', () => {
    const result = globalErrorHandler(
      new TypeError('test'),
      {},
      { status: () => ({ json: err => err }) }
    );
    expect(result).toBeInstanceOf(APIError);
  });
});
