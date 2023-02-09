module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  verbose: true,
  setupFilesAfterEnv: ["jest-os-detection"]
}
