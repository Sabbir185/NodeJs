const request = require('supertest');
const app = require('./app');


beforeAll(async () => {
    console.log('before all')
});

afterAll(async () => {
    console.log('After all')
})

beforeEach(async () => {
    console.log('before each')
})

afterEach(async () => {
    console.log('After each')
})


describe('user controller test suit', () => {
    test('should work', async () => {
        console.log('it is working!')
    })

    test('get all user should return list of users', async () => {
        console.log('get all user test');
        const res = await request(app).get('/users');
        expect(res).not.toBeNull();
    })

})
