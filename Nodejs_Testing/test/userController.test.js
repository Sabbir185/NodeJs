const request = require('supertest');
const app = require('../src/app')

jest.mock('../src/services/userPost.js')

describe('UserController Test Suit', () => {
    test('get return success code and user id', async () => {
        const res = await request(app).get('/user');
        expect(res.statusCode).toBe(200);

        let users = res.body;
        expect(users.length).toBeGreaterThan(0)
        expect(users[0].id).toBe('1')
    });

    test('should return new user id', async () => {

        // create user
        const newUser = { username: 'sabbir007' };
        const res = await request(app).post('/user').send(newUser);

        expect(res.statusCode).toBe(200);
        const body = res.body;
        expect(body._id.length).toEqual(24)
        
        // get user by id
        const getUser = await request(app).get('/user/' + body._id);
        console.log(getUser.body);
        const user = getUser.body;
        expect(user.username).toBe(newUser.username);

    });


})