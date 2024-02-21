/** @type {import('jest').Config} */
const config = {
  roots: ["./src"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  testRegex: ".*\\.GroupEight.spec\\.js$",
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf|xlsx)$":
      "<rootDir>/mocks/fileMock.js",
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  testPathIgnorePatterns: ["/node_modules/"],
  coverageReporters: ["lcov", "text", "text-summary"],
  collectCoverageFrom: [
    "!src/components/**/*.js",
    "src/components/modals/**/*.js",
    "src/private/pages/organisation-settings/**/*.js",
    "src/private/pages/home-page/**/*.js",
    "src/private/pages/quickbooks/**/*.js",
    "src/private/pages/CompaniesHome.js",
  ],
  transformIgnorePatterns: ["node_modules/(?!axios)/"],
  coverageThreshold: {
    global: {
      lines: 75.7,
    },
  },
  reporters: [
    ["jest-slow-test-reporter", { warnOnSlowerThan: 300, color: true }],
    "default",
  ],
};

module.exports = config;
