// npm packages
const request = require('supertest');

// app imports
const app = require('../../app/app');

const {
  auth,
  afterEachHook,
  afterAllHook,
  beforeAllHook,
  beforeEachHook
} = require('./config');

beforeAll(async () => {
  await beforeAllHook();
});

beforeEach(async () => {
  await beforeEachHook(auth);
});

describe('POST /companies', async () => {
  test('Creates a new company', async () => {
    const response = await request(app)
      .post('/companies')
      .send({
        handle: 'whiskey',
        name: 'Whiskey',
        password: 'foo123',
        email: 'whiskey@rithmschool.com'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('handle');
    expect(response.body).not.toHaveProperty('password');
  });
  test('Prevents creating a company with duplicate handle', async () => {
    const response = await request(app)
      .post('/companies')
      .send({
        handle: 'testcompany',
        name: 'Test',
        password: 'foo123',
        email: 'test@rithmschool.com'
      });
    expect(response.statusCode).toBe(409);
  });
  test('Prevents creating a company without required password field', async () => {
    const response = await request(app)
      .post('/companies')
      .send({
        handle: 'test',
        name: 'Test',
        email: 'test@rithmschool.com'
      });
    expect(response.statusCode).toBe(400);
  });
});
describe('GET /companies', async () => {
  test('Gets a list of 1 company', async () => {
    const response = await request(app)
      .get('/companies')
      .set('authorization', `Bearer ${auth.company_token}`);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('handle');
    expect(response.body[0]).not.toHaveProperty('password');
  });
  test('Gets a list of 0 companies with offset and limit', async () => {
    const response = await request(app)
      .get('/companies?offset=1&limit=99')
      .set('authorization', `Bearer ${auth.company_token}`);
    expect(response.body).toHaveLength(0);
  });
  test('Responds with a 400 for invalid offset', async () => {
    const response = await request(app)
      .get('/companies?offset=foo&limit=99')
      .set('authorization', `Bearer ${auth.company_token}`);
    expect(response.statusCode).toBe(400);
  });
  test('Responds with a 400 for invalid limit', async () => {
    const response = await request(app)
      .get('/companies?offset=1&limit=-1')
      .set('authorization', `Bearer ${auth.company_token}`);
    expect(response.statusCode).toBe(400);
  });
});

describe('GET /companies/:handle', async () => {
  test('Gets a single a company', async () => {
    const response = await request(app)
      .get(`/companies/${auth.current_company_handle}`)
      .set('authorization', `Bearer ${auth.company_token}`);
    expect(response.body).toHaveProperty('handle');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.handle).toBe('testcompany');
  });
  test('Responds with a 404 if it cannot find the company in question', async () => {
    const response = await request(app)
      .get(`/companies/yaaasss`)
      .set('authorization', `Bearer ${auth.company_token}`);
    expect(response.statusCode).toBe(404);
  });
});

describe('PATCH /companies/:handle', async () => {
  test("Updates a single a company's name", async () => {
    const response = await request(app)
      .patch(`/companies/${auth.current_company_handle}`)
      .set('authorization', `Bearer ${auth.company_token}`)
      .send({ name: 'xkcd' });
    expect(response.body).toHaveProperty('handle');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.name).toBe('xkcd');
    expect(response.body.handle).not.toBe(null);
  });
  test("Updates a single a company's password", async () => {
    const response = await request(app)
      .patch(`/companies/${auth.current_company_handle}`)
      .set('authorization', `Bearer ${auth.company_token}`)
      .send({ password: 'foo12345' });
    expect(response.body).toHaveProperty('handle');
    expect(response.body).not.toHaveProperty('password');
  });
  test('Prevents a bad company update', async () => {
    const response = await request(app)
      .patch(`/companies/${auth.current_company_handle}`)
      .set('authorization', `Bearer ${auth.company_token}`)
      .send({ cactus: false });
    expect(response.statusCode).toBe(400);
  });
  test('Forbids a company from editing another company', async () => {
    const response = await request(app)
      .patch(`/companies/notme`)
      .set('authorization', `Bearer ${auth.company_token}`)
      .send({ password: 'foo12345' });
    expect(response.statusCode).toBe(403);
  });
  test('Responds with a 404 if it cannot find the company in question', async () => {
    // delete company first
    await request(app)
      .delete(`/companies/${auth.current_company_handle}`)
      .set('authorization', `Bearer ${auth.company_token}`);
    const response = await request(app)
      .patch(`/companies/${auth.current_company_handle}`)
      .set('authorization', `Bearer ${auth.company_token}`)
      .send({ password: 'foo12345' });
    expect(response.statusCode).toBe(404);
  });
});

describe('DELETE /companies/:handle', async () => {
  test('Deletes a single a company', async () => {
    const response = await request(app)
      .delete(`/companies/${auth.current_company_handle}`)
      .set('authorization', `Bearer ${auth.company_token}`);
    expect(response.body).toHaveProperty('handle');
    expect(response.body).not.toHaveProperty('password');
  });
  test('Forbids a company from deleting another company', async () => {
    const response = await request(app)
      .delete(`/companies/notme`)
      .set('authorization', `Bearer ${auth.company_token}`);
    expect(response.statusCode).toBe(403);
  });
  test('Responds with a 404 if it cannot find the company in question', async () => {
    // delete company first
    await request(app)
      .delete(`/companies/${auth.current_company_handle}`)
      .set('authorization', `Bearer ${auth.company_token}`);
    const response = await request(app)
      .delete(`/companies/${auth.current_company_handle}`)
      .set('authorization', `Bearer ${auth.company_token}`);
    expect(response.statusCode).toBe(404);
  });
});

afterEach(async () => {
  await afterEachHook();
});

afterAll(async () => {
  await afterAllHook();
});
