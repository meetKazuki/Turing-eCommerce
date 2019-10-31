import { expect } from 'chai';
import request from 'supertest';

import app from '../../..';

describe('Tax', () => {
  describe('Get all - GET /tax', () => {
    it('should get all taxes', done => {
      request(app)
        .get('/tax')
        .end((_, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('array');
          expect(res.body.data.length).to.equal(0);
          done();
        });
    });
  });
});
