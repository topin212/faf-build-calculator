/** @type {import('ts-jest').JestConfigWithTsJest} */
const tsjest = require('ts-jest')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ["./src/__tests__/setupEnv.ts"],
  testRegex: "/__tests__/.*\\.(test|spec)\\.[jt]sx?$",
  moduleDirectories:[
    "../.yarn/cache"
  ]
};