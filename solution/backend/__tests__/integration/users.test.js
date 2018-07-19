// npm packages
const request = require('supertest');

// app imports
const app = require('../../app/app');

const {
  afterEachHook,
  afterAllHook,
  beforeAllHook,
  beforeEachHook
} = require('./config');

// global auth variable to store things for all the tests
const auth = {};

beforeAll(async () => {
  await beforeAllHook();
});

beforeEach(async () => {
  await beforeEachHook(auth);
});

describe('GET /users', async () => {
  test('Gets a list of 1 user successfully', async () => {
    const response = await request(app)
      .get('/users')
      .set('authorization', `Bearer ${auth.token}`);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('username');
    expect(response.body[0]).not.toHaveProperty('password');
  });
});

afterEach(async () => {
  await afterEachHook();
});

afterAll(async () => {
  await afterAllHook();
});
