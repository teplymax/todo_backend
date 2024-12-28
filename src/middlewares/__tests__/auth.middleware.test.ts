import { mockRequestObject, mockResponseObject, mockNextFunction } from "@__mocks__/requestHandler";
import { User } from "@db/entities/User.entity";
import { TokenPayload } from "@typeDeclarations/token";
import { APIError } from "@utils/errors/apiError";
import { extractTokenFromAuthHeader } from "@utils/stringUtils";

const res = mockResponseObject();

const mockVerifyToken = jest.fn();
jest.mock("@services/tokenService", () => ({
  TokenServiceSingleton: {
    getInstance: () => ({
      verifyToken: mockVerifyToken
    })
  }
}));

const mockGetUserById = jest.fn();
jest.mock("@services/userService", () => ({
  UserServiceSingleton: {
    getInstance: () => ({
      getUserById: mockGetUserById
    })
  }
}));

const { authMiddleware } = await import("@middlewares/auth.middleware");

const mockTokenPayload: TokenPayload = {
  id: "userId",
  nickname: "nickname",
  email: "email"
};

const mockUser = {
  id: "id"
} as User;

const mockHeaders = {
  authorization: "Bearer token"
};

describe("authMiddleware tests", () => {
  afterEach(jest.clearAllMocks);

  it.each([
    mockHeaders,
    {
      authorization: undefined
    }
  ])("should pass request to next handler if token is valid and user exists", async (headers) => {
    mockVerifyToken.mockResolvedValue(mockTokenPayload);
    mockGetUserById.mockResolvedValue(mockUser);
    const req = mockRequestObject({
      headers
    });
    const expectedToken = extractTokenFromAuthHeader(headers.authorization ?? "");

    await authMiddleware(req, res, mockNextFunction);

    expect(mockVerifyToken).toHaveBeenCalledWith({ token: expectedToken, tokenType: "accessToken" });
    expect(mockGetUserById).toHaveBeenCalledWith(mockTokenPayload.id);
    expect(mockNextFunction).toHaveBeenCalled();
    expect(mockNextFunction.mock.calls[0]).toHaveLength(0);
  });

  it("should pass request with APIError to error handler if token is invalid", async () => {
    const mockErrorMessage = "mockErrorMessage";
    const mockAdditionalInfo = "mockAdditionalInfo";
    const req = mockRequestObject({
      headers: mockHeaders
    });

    mockVerifyToken.mockRejectedValue(new APIError(mockErrorMessage, 400, mockAdditionalInfo));
    mockGetUserById.mockResolvedValue(mockUser);

    await authMiddleware(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledWith(
      new APIError("Unauthorised", 401, `${mockAdditionalInfo}|${mockErrorMessage}`)
    );
  });

  it("should pass request with APIError to error handler if user does not exist", async () => {
    const mockErrorMessage = "mockUserErrorMessage";
    const mockAdditionalInfo = "mockUserErrorAdditionalInfo";
    const req = mockRequestObject({
      headers: mockHeaders
    });

    mockVerifyToken.mockResolvedValue(mockTokenPayload);
    mockGetUserById.mockRejectedValue(new APIError(mockErrorMessage, 400, mockAdditionalInfo));

    await authMiddleware(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledWith(
      new APIError("Unauthorised", 401, `${mockAdditionalInfo}|${mockErrorMessage}`)
    );
  });

  it("should pass request with unknown error to error handler if unknow error occurred", async () => {
    const mockError = new Error("unknown error");
    const req = mockRequestObject({
      headers: mockHeaders
    });

    mockVerifyToken.mockResolvedValue(mockTokenPayload);
    mockGetUserById.mockRejectedValue(mockError);

    await authMiddleware(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledWith(mockError);
  });
});
