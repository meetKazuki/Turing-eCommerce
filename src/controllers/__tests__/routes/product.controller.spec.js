import { expect } from 'chai';
import request from 'supertest';
import app from '../../..';
import { Department } from '../../../database/models';
import truncate from '../../../test/helpers';

describe.only('Product Routes', () => {
  let department;
  beforeEach(async done => {
    await truncate();
    department = await Department.create({
      name: 'Groceries',
      description: 'Daily groceries',
    });
    done();
  });

  describe('getAllDepartments', () => {
    it('should return a list of departments', done => {
      request(app)
        .get('/departments')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).to.equal(200);
          expect(typeof res.body).to.equal('object');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data.length).to.equal(1);
          done(error);
        });
    });
  });
});
