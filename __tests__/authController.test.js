const request = require('supertest');
const { describe, it, beforeAll, afterAll, expect } = require('@jest/globals');
const app = require('../app');
const db = require('../config/database');



describe('Auth Controller', () => {
  beforeAll(async () => {
    await db.sync({ force: true });
  });

  afterAll(async () => {
    await db.close();
  });

  describe('POST /signup', () => {
    it('should successfully sign up a new user', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          fullName: 'John Doe',
          username: 'johndoe',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('msg', 'Signup successful');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('fullName', 'John Doe');
      expect(response.body.data).toHaveProperty('username', 'johndoe');
    });

    it('should return 409 if username is already in use', async () => {
      // Create an initial user
      await request(app).post('/api/auth/signup').send({
        fullName: 'Jane Doe',
        username: 'johndoe',
        password: 'password123',
      })

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          fullName: 'John Smith',
          username: 'johndoe',
          password: 'newpassword',
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('msg', 'Username already in use');
    });

    it('should return 400 if validation fails', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          fullName: '',
          username: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg');
    });
  });

  describe('POST /login', () => {
    it('should successfully log in an existing user', async () => {
      await request(app).post('/api/auth/signup').send({
        fullName: 'Jane Doe',
        username: 'johndoe',
        password: 'password123',
      })

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'johndoe',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('msg', 'Login successful');
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 if password is incorrect', async () => {
      // Create a user
      await request(app).post('/api/auth/signup').send({
        fullName: 'Jane Doe',
        username: 'johndoe',
        password: 'password123',
      })

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'johndoe',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('msg', 'Incorrect password');
    });

    it('should return 404 if user is not found', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'password123',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('msg', 'Account not found');
    });
  });
});
