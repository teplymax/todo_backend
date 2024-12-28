import { ValidationError } from "yup";

import { mockRequestObject, mockResponseObject, mockNextFunction } from "@__mocks__/requestHandler";
import { APIError } from "@utils/errors/apiError";

const res = mockResponseObject();

const mockValidate = jest.fn();
jest.mock("@utils/validation", () => ({
  VALIDATORS: {
    loginValidator: {
      validate: mockValidate
    }
  }
}));

const { validationMiddleware } = await import("@middlewares/validation.middleware");

const mockBody = {
  nickname: "nickname",
  email: "email"
};

describe("validationMiddleware tests", () => {
  afterEach(jest.clearAllMocks);

  it("should pass request to next handler if validation succeed", async () => {
    mockValidate.mockResolvedValue(true);
    const req = mockRequestObject({
      body: mockBody
    });

    await validationMiddleware("loginValidator")(req, res, mockNextFunction);

    expect(mockValidate).toHaveBeenCalledWith(mockBody);
    expect(mockNextFunction).toHaveBeenCalled();
    expect(mockNextFunction.mock.calls[0]).toHaveLength(0);
  });

  it("should pass request with valid APIError to error handler if validation fails", async () => {
    const mockError = new ValidationError([new ValidationError("error1"), new ValidationError("error2")]);
    mockValidate.mockRejectedValue(mockError);
    const req = mockRequestObject({
      body: mockBody
    });

    await validationMiddleware("loginValidator")(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledWith(new APIError(mockError.errors.join("\n"), 400));
  });

  it("should pass request with unknown error to error handler if unknow error occurred", async () => {
    const mockError = new Error("unknown error");
    mockValidate.mockRejectedValue(mockError);
    const req = mockRequestObject({
      body: mockBody
    });

    await validationMiddleware("loginValidator")(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledWith(new APIError("Unknown validation error", 400));
  });
});
