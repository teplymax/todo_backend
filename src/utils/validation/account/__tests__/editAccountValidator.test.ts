import { editAccountValidator } from "../editAccountValidator";

interface TestCase {
  payload: {
    email?: string;
    nickname?: string;
    password?: string;
    name?: string;
    surname?: string;
  };
  expectedErrorMessages?: string[];
}

describe("Register validator tests", () => {
  describe("Valid test cases", () => {
    const TEST_CASES: TestCase[] = [
      {
        payload: {
          email: "email@gdf.com",
          nickname: "nickname",
          password: "password123",
          name: "nickname",
          surname: "nickname"
        }
      },
      //surname is missing
      {
        payload: {
          email: "email@gdf.com",
          nickname: "nickname",
          password: "password123",
          name: "nickname"
        }
      },
      //name is missing
      {
        payload: {
          email: "email@gdf.com",
          nickname: "nickname",
          password: "password123",
          surname: "nickname"
        }
      }
    ];

    it.each(TEST_CASES)("should pass validation for valid data", ({ payload }) => {
      const matcher: TestCase["payload"] = {
        email: expect.any(String),
        nickname: expect.any(String),
        password: expect.any(String)
      };

      if ("name" in payload) matcher.name = expect.any(String);
      if ("surname" in payload) matcher.surname = expect.any(String);

      expect(editAccountValidator.validate(payload)).resolves.toMatchObject(matcher);
    });
  });

  describe("Invalid test cases", () => {
    const TEST_CASES: TestCase[] = [
      //Invalid nickname length
      {
        payload: {
          nickname: "n",
          email: "email@gdf.com",
          password: "password123"
        },
        expectedErrorMessages: ["Nickname should have 2 symbols or more"]
      },
      //nickname is missing
      {
        payload: {
          email: "email@gdf.com",
          password: "password123"
        },
        expectedErrorMessages: ["Nickname is required!"]
      },
      //Invalid email format
      {
        payload: {
          email: "emai@___.com",
          nickname: "nickname",
          password: "password123"
        },
        expectedErrorMessages: ["Invalid email format"]
      }
    ];

    it.each(TEST_CASES)("should fail validation for ivalid data", ({ payload, expectedErrorMessages }) => {
      expect(editAccountValidator.validate(payload)).rejects.toMatchObject({
        errors: expectedErrorMessages
      });
    });
  });
});
