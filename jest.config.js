module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ],
  testMatch: ['**/src/**/*.test.js'],
  coverageThreshold: {
    global: {
      branches: 78,
      functions: 78,
      lines: 78,
      statements: 78
    }
  }
};
