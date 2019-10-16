import chai from 'chai';
import request from 'supertest';
import app from '../../../index';
import { user, phone } from '../mocks/users.mock';

const { expect } = chai;
let customerToken;

describe('Authentication Route', () => {
  describe('Signup route', () => {
    it('should successfully POST to signup route', (done) => {
      request(app)
        .post('/customers')
        .send(user)
        .end((err, res) => {
          const { status, message, data } = res.body;
          expect(res.status).to.equal(201);
          expect(status).to.eql('success');
          expect(message).to.eql('Sign-up successfully');
          expect(data).to.be.an('object');
          expect(data).to.have.property('newCustomer');
          expect(data.newCustomer).to.have.property('name');
          expect(data.newCustomer).to.have.property('email');
          expect(data.newCustomer).to.not.have.property('password');
          expect(data).to.have.property('token');
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
          const { status, message, data } = res.body;
          expect(res.status).to.equal(200);
          expect(status).to.eql('success');
          expect(message).to.eql('User log-in successful');
          expect(data).to.be.an('object');
          expect(data).to.have.property('customer');
          expect(data.customer).to.have.property('name');
          expect(data.customer).to.have.property('email');
          expect(data.customer).to.not.have.property('password');
          expect(data).to.have.property('token');
          // customerToken = data.token;
          done(err);
        });
    });

    it('should return an error if email is incorrect', (done) => {
      request(app)
        .post('/customers/login')
        .send({ email: 'backend@turing.com', password: user.password })
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(401);
          expect(status).to.eql('error');
          expect(message).to.eql('Email or Password is incorrect');
          done(err);
        });
    });

    it('should return an error if password is incorrect', (done) => {
      request(app)
        .post('/customers/login')
        .send({ email: user.email, password: 'saligia1993' })
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(401);
          expect(status).to.eql('error');
          expect(message).to.eql('Email or Password is incorrect');
          done(err);
        });
    });
  });
});

describe('Customer Routes', () => {
  beforeEach(done => {
    request(app)
      .post('/customers/login')
      .send({ email: user.email, password: user.password })
      .end((err, res) => {
        customerToken = res.body.data.token;
        done(err);
      });
  });

  describe('GET Customer details', () => {
    it('should retrieve customer details successfully', (done) => {
      request(app)
        .get('/customers')
        .set('user-key', customerToken)
        .end((err, res) => {
          const { status, message, data } = res.body;
          expect(res.status).to.equal(200);
          expect(status).to.eql('success');
          expect(message).to.eql('Customer details retrieved successfully');
          expect(data).to.be.an('object');
          expect(data).to.not.have.property('password');
          done(err);
        });
    });

    it('should throw an error if authorization header is not set', (done) => {
      request(app)
        .get('/customers')
        .end((err, res) => {
          expect(res.status).to.equal(412);
          expect(res.body.status).to.eql('error');
          expect(res.body.message).to.eql('Authorization header not set');
          done(err);
        });
    });

    it('should throw an error if token is empty', (done) => {
      request(app)
        .get('/customers')
        .set('user-key', 'Bearer ')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.status).to.eql('error');
          expect(res.body.message).to.eql('jwt must be provided');
          done(err);
        });
    });
  });

  describe('UPDATE Customer details', () => {
    it('should update customer phone contacts successfully', (done) => {
      request(app)
        .put('/customer')
        .send({ ...phone })
        .set('user-key', customerToken)
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(200);
          expect(data.day_phone).to.equal(phone.day_phone);
          expect(data.eve_phone).to.equal(phone.eve_phone);
          expect(data.mob_phone).to.equal(phone.mob_phone);
          done(err);
        });
    });

    it('should throw an error if an empty request is made', (done) => {
      request(app)
        .put('/customer')
        .send({})
        .set('user-key', customerToken)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(400);
          expect(status).to.eql('error');
          expect(message).to.eql('Request body cannot be empty');
          done(err);
        });
    });

    it('should throw an error if a token is not provided', (done) => {
      request(app)
        .put('/customer')
        .send({})
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(412);
          expect(status).to.eql('error');
          expect(message).to.eql('Authorization header not set');
          done(err);
        });
    });

    it('should throw an error if token is invalid', (done) => {
      request(app)
        .put('/customer')
        .send({ ...phone })
        .set('user-key', `${customerToken}invalid`)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(401);
          expect(status).to.eql('error');
          expect(message).to.eql('invalid signature');
          done(err);
        });
    });
  });
});
