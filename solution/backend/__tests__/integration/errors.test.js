// npm packages
const request = require('supertest');

// app imports
const app = require('../../app/app');

describe('bodyParser error handler', async () => {
  test('Sends a 400 with malformed json', async () => {
    const response = await request(app)
      .post(`/users`)
      .set('content-type', 'application/json')
      .send('%');
    expect(response.statusCode).toBe(400);
    expect(response.body.error.title).toEqual('Bad Request');
  });
});

describe('404 handler', async () => {
  test('Sends a 404 at an undeclared route', async () => {
    const response = await request(app).get(`/foo`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: {
        status: 404,
        title: 'Resource Not Found',
        message: '/foo is not valid path to a LinkedList API resource.'
      }
    });
  });
});

describe('405 handler', async () => {
  test('Sends a 405 with invalid method at a declared route', async () => {
    const response = await request(app).put(`/users`);
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({
      error: {
        status: 405,
        title: 'Method Not Allowed',
        message: 'PUT method is not supported at /users.'
      }
    });
  });
});
