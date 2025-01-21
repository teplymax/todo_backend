import { editCategoryValidator } from "../editCategoryValidator";

interface TestCase {
  payload: {
    name?: string;
  };
  expectedErrorMessages?: string[];
}

describe("Edit category validator tests", () => {
  describe("Valid test cases", () => {
    it("should pass validation for valid data", () => {
      const payload: TestCase["payload"] = {
        name: "name"
      };

      expect(editCategoryValidator.validate(payload)).resolves.toMatchObject({
        name: expect.any(String)
      });
    });
  });

  describe("Invalid test cases", () => {
    const TEST_CASES: TestCase[] = [
      //Invalid name length
      {
        payload: {
          name: "n"
        },
        expectedErrorMessages: ["Category name should have 2 symbols or more"]
      },
      //Missing name
      {
        payload: {},
        expectedErrorMessages: ["Category name is required!"]
      }
    ];

    it.each(TEST_CASES)("should fail validation for ivalid data", ({ payload, expectedErrorMessages }) => {
      expect(editCategoryValidator.validate(payload)).rejects.toMatchObject({
        errors: expectedErrorMessages
      });
    });
  });
});
