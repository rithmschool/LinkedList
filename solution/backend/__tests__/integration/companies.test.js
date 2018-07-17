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

describe('GET /companies', async () => {
  test('Gets a list of 1 company successfully', async () => {
    const response = await request(app)
      .get('/companies')
      .set('authorization', `Bearer ${auth.company_token}`);
    expect(response).toHaveLength(1);
    expect(response[0]).toHaveProperty('handle');
    expect(response[0]).not.toHaveProperty('password');
  });
});

afterEach(async () => {
  await afterEachHook();
});

afterAll(async () => {
  await afterAllHook();
});
