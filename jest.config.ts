/* eslint-disable n/no-unpublished-import */

import { Config } from "jest";
import { createJsWithTsEsmPreset, pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  testEnvironment: "jest-environment-node",
  ...createJsWithTsEsmPreset({
    tsconfig: "./tsconfig.json",
    isolatedModules: true
  }),
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
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
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coveragePathIgnorePatterns: ["/node_modules/", "/db/", "/config/", "/utils/validation/index.ts", "/types/"], // it's to ignore files dedicated for definition of mocked data structure for UT
  testPathIgnorePatterns: ["/node_modules/", "/db/", "/config/", "/utils/validation/index.ts", "/types/"], // it's to ignore files dedicated for definition of mocked data structure for UT
  moduleFileExtensions: ["ts", "js", "json", "node"],
  modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"],
  setupFiles: ["./jest/globals.ts"]
};

export default config;
