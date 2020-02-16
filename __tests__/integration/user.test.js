import request from 'supertest';
import app from '../../src/app';

describe('User', () => {
    let token;

    it('should receive Validation error', async () => {
        const response = await request(app)
            .post('/user')
            .send({
                name: 'test gametask'
            });

        expect(response.body).toEqual({ message: 'Validation error' });
    });

    it('should create user', async () => {
        const response = await request(app)
            .post('/user')
            .send({
                name: 'test gametask',
                email: 'gametask@gametask.com',
                password_hash: 'test123'
            });

        token = response.body.token;

        expect(response.body).toHaveProperty('token');
    });

    it('should receive User already exists!', async () => {
        const response = await request(app)
            .post('/user')
            .send({
                name: 'test gametask',
                email: 'gametask@gametask.com',
                password_hash: 'test123'
            });

        expect(response.body).toEqual({ message: 'User already exists!' });
    });

    it('should receive information about user', async () => {
        const response = await request(app)
            .get('/user/')
            .set('Authorization', 'Bearer ' + token);

        expect(response.body).toHaveProperty('user');
    });

    it('should receive user not found or invalid password', async () => {
        const response = await request(app)
            .post('/user/auth')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: 'gametask@gametask.com',
                password: 'test12333333'
            });

        expect(response.body).toEqual({
            message: 'User not found or Invalid password'
        });
    });

    it('should authenticate as user', async () => {
        const response = await request(app)
            .post('/user/auth')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: 'gametask@gametask.com',
                password: 'test123'
            });

        expect(response.body.token).toEqual(token);
    });

    // TODO: update and delete
});
