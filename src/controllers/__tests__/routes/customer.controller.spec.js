import chai from 'chai';
import request from 'supertest';
import app from '../../../index';

import { user } from '../mocks/users.mock';

const { expect } = chai;

describe('Authentication Route', () => {
  describe('Signup route', () => {
    it('should successfully POST to signup route', (done) => {
      request(app)
        .post('/customers')
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

    it('should throw an error if user already exists', (done) => {
      request(app)
        .post('/customers')
        .send(user)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(409);
          expect(status).to.eql('error');
          expect(message).to.eql('User already exist');
          done(err);
        });
    });
  });

  describe('Signup route validation', () => {
    it('should throw an error if name is not supplied', (done) => {
      request(app)
        .post('/customers')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(400);
          expect(status).to.eql('error');
          expect(message.name).to.eql('Name is required');
          done(err);
        });
    });

    it('should throw an error if email is invalid', (done) => {
      request(app)
        .post('/customers')
        .send({ name: user.name, email: 'wrong', password: user.password })
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(400);
          expect(status).to.eql('error');
          expect(message.email).to.eql('Enter a valid email address');
          done(err);
        });
    });
  });

  describe('Signin route', () => {
    it('should successfully POST to signin route', (done) => {
      request(app)
        .post('/customers/login')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          const { customer, accessToken } = res.body;
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('customer');
          expect(res.body).to.have.property('accessToken');
          expect(customer).to.be.an('object');
          expect(accessToken).to.be.a('string');
          done(err);
        });
    });

    it('should return an error if email is incorrect', (done) => {
      request(app)
        .post('/customers/login')
        .send({ email: 'backend@turing.com', password: user.password })
        .end((err, res) => {
          const { error } = res.body;
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('error');
          expect(error).to.eql('The email doesn\'t exist');
          done(err);
        });
    });

    it('should return an error if password is incorrect', (done) => {
      request(app)
        .post('/customers/login')
        .send({ email: user.email, password: 'saligia1993' })
        .end((err, res) => {
          const { error } = res.body;
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('error');
          expect(error).to.eql('Email or Password is invalid');
          done(err);
        });
    });
  });
});
