/** @type {import('jest').Config} */
const config = {
  roots: ["./src"],
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.{js}"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  testRegex: ".*\\.spec\\.js$",
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf|xlsx)$":
      "<rootDir>/mocks/fileMock.js",
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  testPathIgnorePatterns: ["/node_modules/", "src/assets/*"],
  coverageReporters: ["lcov", "text", "text-summary"],
  collectCoverageFrom: ["src/**/*.js"],
  transformIgnorePatterns: ["node_modules/(?!axios)/"],
  coverageThreshold: {
    global: {
      lines: 75.47,
    },
  },
};

module.exports = config;
