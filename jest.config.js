module.exports = {
  coveragePathIgnorePatterns: [
    '/node_modules',
    '/src/controllers/__tests__/mocks/',
    '/src/database',
    '/src/validations',
  ],
  modulePathIgnorePatterns: ['<rootDir>/build'],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/build',
    '/src/controllers/__tests__/mocks'
  ]
};
