const { describe, it, beforeAll, afterAll, expect } = require('@jest/globals')
const request = require('supertest')
const app = require('../app')
const db = require('../config/database')
const path = require('path')


const testImagePath = path.join(__dirname, 'test.jpg');
const testUser = { username: 'testuser', password: 'testpass', fullName: 'Test User' };
let token;


beforeAll(async () => {
  await db.sync({ force: true });
  await request(app)
    .post('/api/auth/signup')
    .send(testUser)
    .expect(201);

  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: testUser.username, password: testUser.password })
    .expect(200);

  token = res.body.token;
});

afterAll(async () => {
  await db.close();
});

describe('File Controller', () => {
  it('should upload a file', async () => {
    const res = await request(app)
      .post('/api/files')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', testImagePath)
      .expect(201);

    expect(res.body).toHaveProperty('msg');
    expect(res.body).toHaveProperty('jobId');
    expect(res.body.msg).toBe('File added to queue');
  });

  it('should get all files', async () => {
    const res = await request(app)
      .get('/api/files')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('files');
    expect(Array.isArray(res.body.files)).toBe(true);
  });
});
