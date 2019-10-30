import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import app from '../../..';
import { Department } from '../../../database/models';
import truncate from '../../../test/helpers';

describe('Product Routes', () => {
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

    it('should return appropriate status if error occurs on the server', done => {
      const stub = sinon
        .stub(Department, 'findAll')
        .rejects(new Error('server error'));
      request(app)
        .get('/departments')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).to.equal(500);
          stub.restore();
          done(error);
        });
    });
  });

  describe('getDepartment', () => {
    it('should get the details of a department', done => {
      request(app)
        .get(`/departments/${department.department_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.have.property('department_id');
          done(error);
        });
    });

    it('should return appropriate status if department is not found', done => {
      request(app)
        .get('/departments/999999')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).to.equal(404);
          done(error);
        });
    });

    it('should return appropriate status if an error occurs on the server', done => {
      const stub = sinon
        .stub(Department, 'findOne')
        .rejects(new Error('server error'));
      request(app)
        .get(`/departments/${department.department_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).to.equal(500);
          stub.restore();
          done(error);
        });
    });
  });
});
