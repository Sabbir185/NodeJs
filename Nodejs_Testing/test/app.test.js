const request = require('supertest');
const app = require('../src/app')

jest.mock('../src/services/userPost.js')

describe('user controller test suit', () => {
    test('get all user', async () => {
        const res = await request(app).get('/user');
        expect(res.statusCode).toBe(200);

        let users = res.body;
        expect(users.length).toBe(2);
    })
})