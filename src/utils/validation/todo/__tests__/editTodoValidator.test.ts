import { editTodoValidator } from "../editTodoValidator";

interface TestCase {
  payload: {
    title?: string;
    description?: string;
    categories?: string[];
  };
  expectedErrorMessages?: string[];
}

describe("Edit todo validator tests", () => {
  describe("Valid test cases", () => {
    const TEST_CASES: Array<TestCase & { expectedValue: TestCase["payload"] }> = [
      //All data provided
      {
        payload: {
          title: "title",
          description: "description",
          categories: ["categoryId"]
        },
        expectedValue: {
          title: expect.any(String),
          description: expect.any(String),
          categories: expect.any(Array)
        }
      },
      //Categories missing
      {
        payload: {
          title: "title",
          description: "description"
        },
        expectedValue: {
          title: expect.any(String),
          description: expect.any(String)
        }
      },
      //Description missing
      {
        payload: {
          title: "title",
          categories: ["categoryId"]
        },
        expectedValue: {
          title: expect.any(String),
          categories: expect.any(Array)
        }
      },
      //Title missing
      {
        payload: {
          description: "description",
          categories: ["categoryId"]
        },
        expectedValue: {
          description: expect.any(String),
          categories: expect.any(Array)
        }
      }
    ];

    it.each(TEST_CASES)("should pass validation for valid data", ({ payload, expectedValue }) => {
      expect(editTodoValidator.validate(payload)).resolves.toMatchObject(expectedValue);
    });
  });

  describe("Invalid test cases", () => {
    const TEST_CASES: TestCase[] = [
      //Invalid title length
      {
        payload: {
          title: "t",
          description: "description",
          categories: ["categoryId"]
        },
        expectedErrorMessages: ["Todo title should have 2 symbols or more"]
      },
      //Invalid description length
      {
        payload: {
          title: "title",
          description: "",
          categories: ["categoryId"]
        },
        expectedErrorMessages: ["Todo description should have 1 symbol or more"]
      },
      //Invalid categories array
      {
        payload: {
          title: "title",
          description: "description",
          categories: [{ id: "categoryId" } as unknown as string]
        },
        expectedErrorMessages: expect.any(Array)
      }
    ];

    it.each(TEST_CASES)("should fail validation for ivalid data", ({ payload, expectedErrorMessages }) => {
      expect(editTodoValidator.validate(payload)).rejects.toMatchObject({
        errors: expectedErrorMessages
      });
    });
  });
});
