import { loginValidator } from "../loginValidator";

interface TestCase {
  payload: {
    login?: string;
    password?: string;
  };
  expectedErrorMessages?: string[];
}

describe("Login validator tests", () => {
  describe("Valid test cases", () => {
    const TEST_CASES: TestCase[] = [
      {
        payload: {
          login: "nickname",
          password: "password123"
        }
      },
      {
        payload: {
          login: "emai@ghf.com",
          password: "password123"
        }
      }
    ];

    it.each(TEST_CASES)("should pass validation for valid data", ({ payload }) => {
      expect(loginValidator.validate(payload)).resolves.toMatchObject({
        login: expect.any(String),
        password: expect.any(String)
      });
    });
  });

  describe("Invalid test cases", () => {
    const TEST_CASES: TestCase[] = [
      //Invalid nickname length
      {
        payload: {
          login: "n",
          password: "password123"
        },
        expectedErrorMessages: ["Login should be either email or valid nickname"]
      },
      //Invalid email format
      {
        payload: {
          login: "emai@___.com",
          password: "password123"
        },
        expectedErrorMessages: ["Login should be either email or valid nickname"]
      },
      //Missing login
      {
        payload: {
          password: "password123"
        },
        expectedErrorMessages: ["Login is required!"]
      },
      //Invalid password format(less than 8 symbold)
      {
        payload: {
          login: "emai@12213.com",
          password: "passw"
        },
        expectedErrorMessages: ["Password should consist at least 8 symbols including alphabets and numbers"]
      },
      //Invalid password format(no numbers)
      {
        payload: {
          login: "emai@12213.com",
          password: "password"
        },
        expectedErrorMessages: ["Password should consist of alphabets and numbers"]
      },
      //Invalid password format(no alphabets)
      {
        payload: {
          login: "emai@12213.com",
          password: "123456789"
        },
        expectedErrorMessages: ["Password should consist of alphabets and numbers"]
      },
      //Invalid password format(has spaces)
      {
        payload: {
          login: "emai@12213.com",
          password: "password123  1233"
        },
        expectedErrorMessages: ["Password shouldn't consist of spaces"]
      },
      //Missing password
      {
        payload: {
          login: "nickname"
        },
        expectedErrorMessages: ["Password is required!"]
      }
    ];

    it.each(TEST_CASES)("should fail validation for ivalid data", ({ payload, expectedErrorMessages }) => {
      expect(loginValidator.validate(payload)).rejects.toMatchObject({
        errors: expectedErrorMessages
      });
    });
  });
});
