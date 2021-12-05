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

        // post or create user
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


    // get user by id
    test('get a user by id', async () => {
        const res = await request(app).get('/user/1');
        const user = res.body;
        console.log(user)
    })


    // update user
    test('should update an existing user', async () => {
        const exUser = {'id': '1', 'username': 'sabbir100'};
        const response = await request(app).patch('/user').send(exUser);
        const updateResponse = response.body;
        console.log(updateResponse);
        expect(updateResponse.username).toBe(exUser.username)
    });
    

    // delete user
    test('delete by ID and success or fail msg', async () => {
        const id = '1';
        const response = await request(app).delete(`/user/${id}`);
        const deleteInfo = response.body;
        
        // success case
        if(deleteInfo.status) {
            expect(deleteInfo).not.toBe(null);
            expect(response.statusCode).toBe(200);
            expect(deleteInfo.status).toBe('Deleted success');
        }

        // failure case
        if(deleteInfo.correlationId) {
            expect(response.statusCode).toBe(500);
            expect(deleteInfo.message).toBe(`User not found ! for ${id}`);
        }
    })


})