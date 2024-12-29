// eslint-disable-next-line n/no-unpublished-import
import { jest } from "@jest/globals";

global.jest = jest;
global.jest.mock = jest.unstable_mockModule as unknown as typeof global.jest.mock;
