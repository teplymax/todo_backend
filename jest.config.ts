/* eslint-disable n/no-unpublished-import */

import { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  // reporters: ["default", ["jest-junit", { outputDirectory: "__test-results__", reportTestSuiteErrors: true }]],
  // coverageReporters: ["cobertura", "lcov", "text-summary"],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest"
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: "<rootDir>/" }),
  transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
  reporters: ["default"],
  coverageDirectory: "__coverage__",
  coverageThreshold: {
    global: {
      statements: 74,
      branches: 61,
      functions: 68,
      lines: 75
    }
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/"], // it's to ignore files dedicated for definition of mocked data structure for UT
  testPathIgnorePatterns: ["/node_modules/"], // it's to ignore files dedicated for definition of mocked data structure for UT
  // setupFiles: ["./jest/globals.js"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"]
};

export default config;
