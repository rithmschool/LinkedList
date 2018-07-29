const { ensureAuth } = require('../../app/middleware');
const { APIError } = require('../../app/helpers');

describe('Ensure Auth Middleware', () => {
  test('Sends a 401 to next() if the token is bad', () => {
    const result = ensureAuth(
      { headers: { authorization: 'bad token' } },
      {},
      err => err
    );
    expect(result).toBeInstanceOf(APIError);
    expect(result.status).toBe(401);
  });
});
