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

describe('POST /jobs/:jobId/applications', async () => {
  test('Lets user apply to a job', async () => {
    const newJobResponse = await request(app)
      .post(`/jobs`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`)
      .send({
        title: 'QA Engineer',
        salary: '110k',
        company: TEST_DATA.currentCompanyHandle
      });
    const response = await request(app)
      .post(`/jobs/${newJobResponse.body.id}/applications`)
      .set('authorization', `Bearer ${TEST_DATA.userToken}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(TEST_DATA.currentUsername);
  });
});

describe('GET /jobs/:jobId/applications', async () => {
  test('Lets user see their job application', async () => {
    const response = await request(app)
      .get(`/jobs/${TEST_DATA.jobId}/applications`)
      .set('authorization', `Bearer ${TEST_DATA.userToken}`);
    console.log(response.body);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0].username).toBe(TEST_DATA.currentUsername);
  });

  test('Lets company see their job applications', async () => {
    const response = await request(app)
      .get(`/jobs/${TEST_DATA.jobId}/applications`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('Responds with a 400 for invalid offset', async () => {
    const response = await request(app)
      .get(`/jobs/${TEST_DATA.jobId}/applications?offset=foo&limit=50`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(400);
  });

  test('Responds with a 400 for invalid limit', async () => {
    const response = await request(app)
      .get(`/jobs/${TEST_DATA.jobId}/applications?offset=1&limit=-1`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(400);
  });
});

describe('GET /jobs/:jobId/applications/:applicationId', async () => {
  test('Gets a single a job application', async () => {
    const response = await request(app)
      .get(`/jobs/${TEST_DATA.jobId}/applications/${TEST_DATA.jobAppId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(TEST_DATA.jobId);
  });

  test('Sends a 400 if a non-integer job ID is sent', async () => {
    const response = await request(app)
      .get(`/jobs/foo/applications`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(400);
  });

  test('Responds with a 404 if it cannot find the job in question', async () => {
    const response = await request(app)
      .get(`/jobs/999/applications`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(404);
  });
});

describe('DELETE /jobs/:jobId/applications/:applicationId', async () => {
  test('Deletes a single a job application as a user', async () => {
    const response = await request(app)
      .delete(`/jobs/${TEST_DATA.jobId}/applications/${TEST_DATA.jobAppId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.body).toHaveProperty('id');
  });

  test('Deletes a single a job application as a company', async () => {
    const response = await request(app)
      .delete(`/jobs/${TEST_DATA.jobId}/applications/${TEST_DATA.jobAppId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.body).toHaveProperty('id');
  });

  test('Sends a 400 if a non-integer job ID is sent', async () => {
    const response = await request(app)
      .get(`/jobs/foo/applications/2`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    expect(response.statusCode).toBe(400);
  });

  test("Forbids a company from deleting another company's job application", async () => {
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
      .delete(`/jobs/${TEST_DATA.jobId}/applications/${TEST_DATA.jobAppId}`)
      .set('authorization', `Bearer ${otherCompanyToken}`);
    expect(response.statusCode).toBe(404);
  });

  test('Responds with a 404 if it cannot find the job application in question', async () => {
    // delete job first
    await request(app)
      .delete(`/jobs/${TEST_DATA.jobId}/applications/${TEST_DATA.jobAppId}`)
      .set('authorization', `Bearer ${TEST_DATA.companyToken}`);
    const response = await request(app)
      .delete(`/jobs/${TEST_DATA.jobId}/applications/${TEST_DATA.jobAppId}`)
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
