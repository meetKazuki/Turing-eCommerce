import chai from 'chai';
import request from 'supertest';
import app from '../../../index';

import { user } from '../mocks/users.mock';

const { expect } = chai;

describe('Authentication Route', () => {
  describe('Signup routes', () => {
    it('should successfully POST to signup route', (done) => {
      request(app)
        .post('/customers/signup')
        .send(user)
        .end((err, res) => {
          const { customer, accessToken } = res.body;
          expect(res.status).to.equal(201);
          expect(customer).to.be.an('object');
          expect(customer).to.have.property('name');
          expect(customer).to.have.property('email');
          expect(customer).to.not.have.property('password');
          expect(accessToken).to.be.a('string');
          done(err);
        });
    });
  });
});
