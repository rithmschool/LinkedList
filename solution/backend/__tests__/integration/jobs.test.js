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

describe('POST /jobs', async () => {
  test('Creates a new job', async () => {
    const response = await request(app)
      .post('/jobs')
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({
        title: 'Software Engineer in Test',
        salary: '120k',
        equity: 2,
        company: TEST_DATA.currentCompanyHandle
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  test('Prevents creating a job without required title field', async () => {
    const response = await request(app)
      .post('/jobs')
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({
        salary: '120k',
        equity: 2,
        company: TEST_DATA.currentCompanyHandle
      });
    expect(response.statusCode).toBe(400);
  });

  test('Prevents creating a job as a non-company user', async () => {
    const response = await request(app)
      .post('/jobs')
      .set('authorization', `Bearer ${TEST_DATA.userToken}`)
      .send({
        title: 'Software Engineer in Test',
        salary: '120k',
        equity: 2,
        company: 'testcompany'
      });
    expect(response.statusCode).toBe(403);
  });

  test('Prevents creating a job for a different company', async () => {
    const response = await request(app)
      .post('/jobs')
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({
        title: 'Software Engineer in Test',
        salary: '120k',
        equity: 2,
        company: 'rithm'
      });
    expect(response.statusCode).toBe(403);
  });
});

describe('GET /jobs', async () => {
  test('Gets a list of 1 job', async () => {
    const response = await request(app)
      .get('/jobs')
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('Gets a list of 0 jobs with offset and limit', async () => {
    const response = await request(app)
      .get('/jobs?offset=1&limit=99')
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.body).toHaveLength(0);
  });

  test('Responds with a 400 for invalid offset', async () => {
    const response = await request(app)
      .get('/jobs?offset=foo&limit=99')
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(400);
  });

  test('Responds with a 400 for invalid limit', async () => {
    const response = await request(app)
      .get('/jobs?offset=1&limit=-1')
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(400);
  });

  test('Has working search', async () => {
    await request(app)
      .post('/jobs')
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({
        title: 'Software Engineer in Test',
        salary: '120k',
        equity: 2,
        company: TEST_DATA.currentCompanyHandle
      });

    await request(app)
      .post('/jobs')
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({
        title: 'Web Dev',
        salary: '120k',
        company: TEST_DATA.currentCompanyHandle
      });

    const response = await request(app)
      .get('/jobs?search=web+dev')
      .set('authorization', `Bearer ${TEST_DATA.userToken}`);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('id');
  });
});

describe('GET /jobs/:id', async () => {
  test('Gets a single a job', async () => {
    const response = await request(app)
      .get(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.body).toHaveProperty('id');

    expect(response.body.id).toBe(TEST_DATA.jobId);
  });

  test('Sends a 400 if a non-integer job ID is sent', async () => {
    const response = await request(app)
      .get(`/jobs/foo`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(400);
  });

  test('Responds with a 404 if it cannot find the job in question', async () => {
    const response = await request(app)
      .get(`/jobs/999`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(404);
  });
});

describe('PATCH /jobs/:id', async () => {
  test("Updates a single a job's title", async () => {
    const response = await request(app)
      .patch(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({ title: 'xkcd' });
    expect(response.body).toHaveProperty('id');

    expect(response.body.title).toBe('xkcd');
    expect(response.body.id).not.toBe(null);
  });

  test('Sends a 400 if a non-integer job ID is sent', async () => {
    const response = await request(app)
      .patch(`/jobs/foo`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({ title: 'xkcd' });
    expect(response.statusCode).toBe(400);
  });

  test("Updates a single a job's equity", async () => {
    const response = await request(app)
      .patch(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({ equity: 0.5 });
    expect(response.body).toHaveProperty('id');
  });

  test('Prevents a bad job update', async () => {
    const response = await request(app)
      .patch(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({ cactus: false });
    expect(response.statusCode).toBe(400);
  });

  test("Forbids a company from editing another company's job", async () => {
    await request(app)
      .post('/companies')
      .send({
        name: 'hooli',
        handle: 'hooli',
        password: 'foo123',
        email: 'test@hooli.com'
      });

    const authRes = await request(app)
      .post('/company-auth')
      .send({ handle: 'hooli', password: 'foo123' });
    const otherCompanyToken = authRes.body.token;
    const response = await request(app)
      .patch(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${otherCompanyToken}`)
      .send({ title: 'foo12345' });
    expect(response.statusCode).toBe(403);
  });

  test('Responds with a 404 if it cannot find the job in question', async () => {
    // delete job first
    await request(app)
      .delete(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    const response = await request(app)
      .patch(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({ title: 'instructor' });
    expect(response.statusCode).toBe(404);
  });
});

describe('DELETE /jobs/:id', async () => {
  test('Deletes a single a job', async () => {
    const response = await request(app)
      .delete(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.body).toHaveProperty('id');
  });

  test('Sends a 400 if a non-integer job ID is sent', async () => {
    const response = await request(app)
      .get(`/jobs/foo`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(400);
  });

  test("Forbids a company from deleting another company's job", async () => {
    await request(app)
      .post('/companies')
      .send({
        name: 'hooli',
        handle: 'hooli',
        password: 'foo123',
        email: 'test@hooli.com'
      });

    const authRes = await request(app)
      .post('/company-auth')
      .send({ handle: 'hooli', password: 'foo123' });
    const otherCompanyToken = authRes.body.token;
    const response = await request(app)
      .delete(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${otherCompanyToken}`);
    expect(response.statusCode).toBe(403);
  });

  test('Responds with a 404 if it cannot find the job in question', async () => {
    // delete job first
    await request(app)
      .delete(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    const response = await request(app)
      .delete(`/jobs/${TEST_DATA.jobId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(404);
  });
});

afterEach(async () => {
  await afterEachHook();
});

afterAll(async () => {
  await afterAllHook();
});
