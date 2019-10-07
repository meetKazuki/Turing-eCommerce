import chai from 'chai';
import app from '../../index';

const { expect } = chai;

describe('App is setup correctly', () => {
  it('should confirm app is a function', () => {
    expect(app).to.be.a('function');
  });
});
