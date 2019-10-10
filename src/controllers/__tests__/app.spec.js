import chai from 'chai';
import app from '../../index';

const { expect } = chai;

describe('App is setup correctly', () => {
  it('should confirm app is a function', () => {
    expect(app).to.be.a('function');
  });

  it('should set NODE_ENV as test', () => {
    expect(process.env.NODE_ENV).to.eql('test');
  });
});
