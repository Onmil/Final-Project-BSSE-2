module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).[jt]s'],
  setupFiles: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000,
};