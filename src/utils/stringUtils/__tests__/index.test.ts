import {
  extractTokenFromAuthHeader,
  generateVerificationCode,
  parsePaginationQueryParams,
  parseTokenExpTimeToMs
} from "..";

describe("String utils tests", () => {
  it("generateVerificationCode should generate 5 digit code", () => {
    const result = generateVerificationCode();

    expect(result).toBeLessThanOrEqual(9999);
    expect(result).toBeGreaterThanOrEqual(1000);
  });

  it("extractTokenFromAuthHeader should extract token correctly", () => {
    const result = extractTokenFromAuthHeader("Bearer token");

    expect(result).toEqual("token");
  });

  it.each([
    {
      input: "15d",
      expectedOutput: 15 * 24 * 60 * 60 * 1000
    },
    {
      input: "15m",
      expectedOutput: 15 * 60 * 1000
    }
  ])("parseTokenExpTimeToMs should parse token expiration time correctly", ({ input, expectedOutput }) => {
    const result = parseTokenExpTimeToMs(input);

    expect(result).toEqual(expectedOutput);
  });

  it.each([
    {
      input: {
        limit: "10",
        page: "2"
      },
      expectedOutput: {
        limit: 10,
        page: 2
      }
    },
    {
      input: {
        limit: "10"
      },
      expectedOutput: undefined
    },
    {
      input: {
        page: "10"
      },
      expectedOutput: undefined
    }
  ])("parsePaginationQueryParams should parse query params correctly", ({ input, expectedOutput }) => {
    const result = parsePaginationQueryParams(input);

    expect(result).toEqual(expectedOutput);
  });
});
