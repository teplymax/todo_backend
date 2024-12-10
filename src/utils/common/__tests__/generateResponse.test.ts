import { generateResponse } from "../generateResponse";

const mockPayload = { test: "test" };

describe("generateResponse tests", () => {
  it("should generate correct response object", () => {
    const response = generateResponse(mockPayload);

    expect(response).toEqual({
      success: true,
      payload: mockPayload
    });
  });
});
