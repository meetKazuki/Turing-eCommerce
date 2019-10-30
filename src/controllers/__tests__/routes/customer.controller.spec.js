import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import app from '../../..';
import capitalize from '../../../helpers/capitalize';
import { Customer } from '../../../database/models';
import {
  user, user_2, phone, card, invalidCard, address
} from '../mocks/users.mock';

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
          expect(message).to.eql('sign-up successfully');
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
          expect(message).to.eql('user already exist');
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
          expect(message.name).to.eql('name is required');
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
          expect(message.email).to.eql('enter a valid email address');
          done(err);
        });
    });

    it('should return appropriate status if an error occurs on the server', done => {
      const stub = sinon
        .stub(Customer, 'create')
        .rejects(new Error('server error'));
      request(app)
        .post('/customers')
        .send(user_2)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).to.equal(500);
          stub.restore();
          done(error);
        });
    });
  });

  describe('Signin route', () => {
    it('should return an error if email is incorrect', (done) => {
      request(app)
        .post('/customers/login')
        .send({ email: 'backend@turing.com', password: user.password })
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(401);
          expect(status).to.eql('error');
          expect(message).to.eql('email or password is incorrect');
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
          expect(message).to.eql('email or password is incorrect');
          done(err);
        });
    });

    it('should successfully POST to signin route', (done) => {
      request(app)
        .post('/customers/login')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          const { status, message, data } = res.body;
          expect(res.status).to.equal(200);
          expect(status).to.eql('success');
          expect(message).to.eql('user log-in successful');
          expect(data).to.be.an('object');
          expect(data).to.have.property('customer');
          expect(data.customer).to.have.property('name');
          expect(data.customer).to.have.property('email');
          expect(data.customer).to.not.have.property('password');
          expect(data).to.have.property('token');
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

  describe('UPDATE Customer profile information', () => {
    it('should throw an error if an empty request is made', (done) => {
      request(app)
        .put('/customer')
        .set('user-key', customerToken)
        .send({})
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(400);
          expect(status).to.eql('error');
          expect(message).to.eql('request body cannot be empty');
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
          expect(message).to.eql('authorization header not set');
          done(err);
        });
    });

    it('should throw an error if token is invalid', (done) => {
      request(app)
        .put('/customer')
        .set('user-key', `${customerToken}invalid`)
        .send({ ...phone })
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(401);
          expect(status).to.eql('error');
          expect(message).to.eql('invalid signature');
          done(err);
        });
    });

    it('should update customer phone contacts successfully', (done) => {
      request(app)
        .put('/customer')
        .set('user-key', customerToken)
        .send({ ...phone })
        .end((err, res) => {
          const { data } = res.body;
          expect(res.status).to.equal(200);
          expect(data.day_phone).to.equal(phone.day_phone);
          expect(data.eve_phone).to.equal(phone.eve_phone);
          expect(data.mob_phone).to.equal(phone.mob_phone);
          done(err);
        });
    });

    it.skip('should return appropriate status if error occurs on server', done => {
      const stub = sinon
        .stub(Customer, 'update')
        .rejects(new Error('server error'));
      request(app)
        .put('/customer/address')
        .set('user-key', customerToken)
        .send({ ...address })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          stub.restore();
          done(err);
        });
    });
  });

  describe('UPDATE Customer credit-card information', () => {
    it('should throw an error if a token is not provided', (done) => {
      request(app)
        .put('/customer/creditCard')
        .send({})
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(412);
          expect(status).to.eql('error');
          expect(message).to.eql('authorization header not set');
          done(err);
        });
    });

    it('should throw an error if token is invalid', (done) => {
      request(app)
        .put('/customer/creditCard')
        .set('user-key', `${customerToken}invalid`)
        .send(card)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(401);
          expect(status).to.eql('error');
          expect(message).to.eql('invalid signature');
          done(err);
        });
    });

    it('should throw an error if credit-card details is invalid', (done) => {
      request(app)
        .put('/customer/creditCard')
        .set('user-key', customerToken)
        .send(invalidCard)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(400);
          expect(status).to.eql('error');
          expect(message.credit_card)
            .to.eql('credit_card must be between 12 to 19 digits');
          done(err);
        });
    });

    it('should update credit-card information', (done) => {
      request(app)
        .put('/customer/creditCard')
        .set('user-key', customerToken)
        .send(card)
        .end((err, res) => {
          const { status, message, data } = res.body;
          expect(res.status).to.equal(200);
          expect(status).to.eql('success');
          expect(message).to.eql('update successful');
          expect(data.credit_card).to.equal(card.credit_card);
          done(err);
        });
    });
  });

  describe('UPDATE Customer address information', () => {
    it('should throw an error if a token is not provided', (done) => {
      request(app)
        .put('/customer/address')
        .send({})
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(412);
          expect(status).to.eql('error');
          expect(message).to.eql('authorization header not set');
          done(err);
        });
    });

    it('should throw an error if token is invalid', (done) => {
      request(app)
        .put('/customer/address')
        .set('user-key', `${customerToken}invalid`)
        .send(card)
        .end((err, res) => {
          const { status, message } = res.body;
          expect(res.status).to.equal(401);
          expect(status).to.eql('error');
          expect(message).to.eql('invalid signature');
          done(err);
        });
    });

    it('should update address information', (done) => {
      request(app)
        .put('/customer/address')
        .set('user-key', customerToken)
        .send({ ...address })
        .end((err, res) => {
          const { status, message, data } = res.body;
          expect(res.status).to.equal(200);
          expect(status).to.eql('success');
          expect(message).to.eql('update successful');
          expect(data.address_1).to.equal(address.address_1);
          expect(data.address_2).to.equal(address.address_2);
          expect(data.city).to.equal(capitalize(address.city));
          expect(data.region).to.equal(capitalize(address.region));
          expect(data.country).to.equal(capitalize(address.country));
          expect(parseInt(data.shipping_region_id, 10))
            .to.equal(parseInt(address.shipping_region_id, 10));
          done(err);
        });
    });
  });

  describe('GET Customer details', () => {
    it('should throw an error if authorization header is not set', (done) => {
      request(app)
        .get('/customers')
        .end((err, res) => {
          expect(res.status).to.equal(412);
          expect(res.body.status).to.eql('error');
          expect(res.body.message).to.eql('authorization header not set');
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

    it('should retrieve customer details successfully', (done) => {
      request(app)
        .get('/customers')
        .set('user-key', customerToken)
        .end((err, res) => {
          const { status, message, data } = res.body;
          expect(res.status).to.equal(200);
          expect(status).to.eql('success');
          expect(message).to.eql('retrieval successful');
          expect(data).to.be.an('object');
          expect(data).to.not.have.property('password');
          done(err);
        });
    });

    it.skip('should return appropriate status if an error occurs on the server', done => {
      const stub = sinon
        .stub(Customer, 'findByPk')
        .rejects(new Error('server error'));
      request(app)
        .get('/customers')
        .set('user-key', customerToken)
        .end((error, res) => {
          console.log('error -->***', error);
          console.log('error response ->>))', res.body);
          expect(res.status).to.equal(500);
          stub.restore();
          done(error);
        });
    });
  });
});
