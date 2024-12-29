import { registerValidator } from "../registerValidator";

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

      expect(registerValidator.validate(payload)).resolves.toMatchObject(matcher);
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
      },
      //email missing
      {
        payload: {
          nickname: "nickname",
          password: "password123"
        },
        expectedErrorMessages: ["Email is required!"]
      },
      //Invalid password format(less than 8 symbold)
      {
        payload: {
          nickname: "nnickname",
          email: "email@gdf.com",
          password: "passw"
        },
        expectedErrorMessages: ["Password should consist at least 8 symbols including alphabets and numbers"]
      },
      //Invalid password format(no numbers)
      {
        payload: {
          nickname: "nnickname",
          email: "email@gdf.com",
          password: "password"
        },
        expectedErrorMessages: ["Password should consist of alphabets and numbers"]
      },
      //Invalid password format(no alphabets)
      {
        payload: {
          nickname: "nnickname",
          email: "email@gdf.com",
          password: "123456789"
        },
        expectedErrorMessages: ["Password should consist of alphabets and numbers"]
      },
      //Invalid password format(has spaces)
      {
        payload: {
          nickname: "nnickname",
          email: "email@gdf.com",
          password: "password123  1233"
        },
        expectedErrorMessages: ["Password shouldn't consist of spaces"]
      },
      //Missing password
      {
        payload: {
          nickname: "nnickname",
          email: "email@gdf.com"
        },
        expectedErrorMessages: ["Password is required!"]
      }
    ];

    it.each(TEST_CASES)("should fail validation for ivalid data", ({ payload, expectedErrorMessages }) => {
      expect(registerValidator.validate(payload)).rejects.toMatchObject({
        errors: expectedErrorMessages
      });
    });
  });
});
