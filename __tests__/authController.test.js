const request = require('supertest')
const app = require('../app')
const { it, describe, expect, beforeAll, afterAll } = require('@jest/globals');
const db = require('../config/database')

beforeAll(async() => {
    await db.truncate()
})

describe('Auth Controller tests', () => {
    it('should signup successfully', async () => {
        const response = await request(app).post('/api/auth/signup').send({
            fullName:'Test User',
            username:'tester123',
            password: 'test123456'
        })

        expect(response.status).toBe(201)
        expect(response.body.msg).toBe('Signup successful!')
        expect(response.body.data.username).toBe('tester123')
    })

    it('should login successfully', async () => {
        const response = await request(app).post('/api/auth/login').send({
            username:'tester123',
            password: 'test123456'
        })

        expect(response.status).toBe(200)
        expect(response.body.msg).toBe('Login successful')
        expect(response.body.token).toBeDefined()
    })
})