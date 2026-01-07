/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/lib/$1',
  },
  collectCoverageFrom: ['lib/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: ['\\.d\\.ts$', '\\.interface\\.ts$', 'types\\.ts$'],
};
