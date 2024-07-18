export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  preset: 'ts-jest',

  // reporters 
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage/test-report',
        outputName: 'test-report.xml',
      },
    ],
  ],
  // coverage directory 
  coverageDirectory: './coverage',
  collectCoverage: true,
  coverageReporters: ["cobertura", "lcov", "html"],
};