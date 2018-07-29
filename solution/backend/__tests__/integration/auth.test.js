// npm packages
const request = require('supertest');

// app imports
const app = require('../../app/app');

const {
  TEST_DATA,
  afterEachHook,
  afterAllHook,
  beforeAllHook,
  beforeEachHook
} = require('./config');

beforeAll(async () => {
  await beforeAllHook();
});

beforeEach(async () => {
  await beforeEachHook(TEST_DATA);
});

describe('User Auth Handler', async () => {
  test('Sends a 400 back for invalid login schema', async () => {
    const response = await request(app)
      .post('/user-auth')
      .send({ foo: 'bar' });
    expect(response.statusCode).toBe(400);
  });
  test('Sends a 404 back for user not found', async () => {
    const response = await request(app)
      .post('/user-auth')
      .send({ username: 'whoops', password: 'foo123' });
    expect(response.statusCode).toBe(404);
  });
  test('Sends a 401 back for an invalid password', async () => {
    const response = await request(app)
      .post('/user-auth')
      .send({ username: 'test', password: 'thisisnotyourpassword' });
    expect(response.statusCode).toBe(401);
  });
});

describe('Company Auth Handler', async () => {
  test('Sends a 400 back for invalid login schema', async () => {
    const response = await request(app)
      .post('/company-auth')
      .send({ handle: 'bar' });
    expect(response.statusCode).toBe(400);
  });
  test('Sends a 404 back for company not found', async () => {
    const response = await request(app)
      .post('/company-auth')
      .send({ handle: 'whoops', password: 'foo123' });
    expect(response.statusCode).toBe(404);
  });
  test('Sends a 401 back for an invalid password', async () => {
    const response = await request(app)
      .post('/company-auth')
      .send({ handle: 'testcompany', password: 'thisisnotyourpassword' });
    expect(response.statusCode).toBe(401);
  });
});

afterEach(async () => {
  await afterEachHook();
});

afterAll(async () => {
  await afterAllHook();
});
