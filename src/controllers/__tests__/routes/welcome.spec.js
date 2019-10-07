import chai from 'chai';
import request from 'supertest';
import app from '../../../index';

const { expect } = chai;

describe('Welcome routes', () => {
  it('should return a welcome message on index route', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        const { success, message } = res.body;
        expect(res.status).to.equal(200);
        expect(success).to.equal(true);
        expect(message).to.eql('Welcome to Turing e-Commerce shop API');
        done(err);
      });
  });
});
