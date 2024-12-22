// eslint-disable-next-line n/no-unpublished-import
import { jest as Globals } from "@jest/globals";

declare global {
  namespace jest {
    declare let jestGlobals: typeof Globals;
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
