import { createTodoValidator } from "../createTodoValidator";

interface TestCase {
  payload: {
    title?: string;
    description?: string;
    categories?: string[];
  };
  expectedErrorMessages?: string[];
}

describe("Create todo validator tests", () => {
  describe("Valid test cases", () => {
    const TEST_CASES: TestCase[] = [
      {
        payload: {
          title: "title",
          description: "description",
          categories: ["categoryId"]
        }
      },
      {
        payload: {
          title: "title",
          description: "description"
        }
      }
    ];

    it.each(TEST_CASES)("should pass validation for valid data", ({ payload }) => {
      const expectedValue = payload.categories
        ? {
            title: expect.any(String),
            description: expect.any(String),
            categories: expect.any(Array)
          }
        : {
            title: expect.any(String),
            description: expect.any(String)
          };

      expect(createTodoValidator.validate(payload)).resolves.toMatchObject(expectedValue);
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
      //Missing title
      {
        payload: {
          description: "description",
          categories: ["categoryId"]
        },
        expectedErrorMessages: ["Title is required!"]
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
      expect(createTodoValidator.validate(payload)).rejects.toMatchObject({
        errors: expectedErrorMessages
      });
    });
  });
});
