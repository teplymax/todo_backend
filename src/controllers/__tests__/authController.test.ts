import { mockNextFunction, mockRequestObject, mockResponseObject } from "@__mocks__/requestHandler";
import config from "@config/index";
import { User } from "@db/entities/User.entity";
import { UserMapper } from "@services/userService/user.mapper";
import { LoginPayload, RegisterPayload, VerifyPayload } from "@typeDeclarations/auth";
import { TokenPayload } from "@typeDeclarations/token";
import { generateResponse } from "@utils/common/generateResponse";
import { APIError } from "@utils/errors/apiError";
import { extractTokenFromAuthHeader, parseTokenExpTimeToMs } from "@utils/stringUtils";

const res = mockResponseObject();

const mockTokenPayload: TokenPayload = {
  id: "userId",
  nickname: "nickname",
  email: "email"
};

const mockUser = {
  id: "id",
  nickname: "nickname",
  email: "email",
  verificationCode: "1234",
  token: {
    refreshToken: "refreshToken"
  }
} as User;

const mockResentVerificationCode = "5678";

const mockHeaders = {
  authorization: "Bearer token"
};

const mockGeneratedAccessToken = "mockGeneratedAccessToken";
const mockGeneratedRefreshToken = "mockGeneratedRefreshToken";

const mockGenerateTokens = jest.fn().mockImplementation((_payload, accessTokenOnly: boolean) => {
  if (accessTokenOnly) {
    return {
      accessToken: mockGeneratedAccessToken
    };
  } else {
    return { refreshToken: mockGeneratedRefreshToken, accessToken: mockGeneratedAccessToken };
  }
});
const mockDecodeToken = jest.fn().mockReturnValue(mockTokenPayload);
const mockVerifyToken = jest.fn().mockResolvedValue(mockTokenPayload);
const mockSaveToken = jest.fn();
const mockRemoveToken = jest.fn();
jest.mock("@services/tokenService", () => ({
  TokenServiceSingleton: {
    getInstance: () => ({
      generateTokens: mockGenerateTokens,
      decodeToken: mockDecodeToken,
      verifyToken: mockVerifyToken,
      saveToken: mockSaveToken,
      removeToken: mockRemoveToken
    })
  }
}));

const mockGetUserById = jest.fn().mockResolvedValue(mockUser);
const mockDeleteUnverifiedUsers = jest.fn();
jest.mock("@services/userService", () => ({
  UserServiceSingleton: {
    getInstance: () => ({
      getUserById: mockGetUserById,
      deleteUnverifiedUsers: mockDeleteUnverifiedUsers
    })
  }
}));

const mockWorker = jest.fn();
jest.mock("worker_threads", () => ({
  Worker: mockWorker
}));

const mockCronJob = jest.fn();
jest.mock("cron", () => ({
  CronJob: mockCronJob
}));

const mockRegister = jest.fn().mockResolvedValue(mockUser);
const mockVerify = jest.fn().mockResolvedValue(mockUser);
const mockLogin = jest.fn().mockResolvedValue(mockUser);
const mockResendVerification = jest.fn().mockReturnValue(mockResentVerificationCode);
jest.mock("@services/authService", () => ({
  AuthServiceSingleton: {
    getInstance: () => ({
      register: mockRegister,
      verify: mockVerify,
      login: mockLogin,
      resendVerification: mockResendVerification
    })
  }
}));

const { authController } = await import("@controllers/AuthController/index");

describe("AuthController tests", () => {
  afterEach(jest.clearAllMocks);

  it("should register cron job to delete unverified users from db every 24 hours", () => {
    expect(mockCronJob).toHaveBeenCalledWith("0 0 * * *", mockDeleteUnverifiedUsers, null, true);
  });

  describe("register tests", () => {
    it("should register user and send access token and user as a success response", async () => {
      const req = mockRequestObject<RegisterPayload>({
        body: {
          email: "email",
          nickname: "test",
          password: "password"
        }
      });

      await authController.register(req, res, mockNextFunction);

      expect(mockRegister).toHaveBeenCalledWith(req.body);
      expect(mockWorker).toHaveBeenCalledWith("./src/workers/VerificationEmailWorker/index.cjs", {
        workerData: {
          email: mockUser.email,
          code: mockUser.verificationCode
        }
      });
      expect(mockGenerateTokens).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
          nickname: mockUser.nickname
        },
        true
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          accessToken: mockGeneratedAccessToken,
          user: UserMapper.getInstance().map(mockUser)
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockRegister.mockRejectedValue(mockError);
      const req = mockRequestObject<RegisterPayload>({
        body: {
          email: "email",
          nickname: "test",
          password: "password"
        }
      });

      await authController.register(req, res, mockNextFunction);

      expect(mockRegister).toHaveBeenCalledWith(req.body);
      expect(mockWorker).not.toHaveBeenCalled();
      expect(mockGenerateTokens).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("verify tests", () => {
    it("should verify user,set refreshToken to cookies and send access token and user as a success response", async () => {
      const req = mockRequestObject<VerifyPayload>({
        headers: mockHeaders,
        body: {
          verificationCode: "7890"
        }
      });

      await authController.verify(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockVerify).toHaveBeenCalledWith(req.body, mockTokenPayload.id);
      expect(mockGenerateTokens).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.nickname
      });
      expect(mockSaveToken).toHaveBeenCalledWith(mockUser.id, mockGeneratedRefreshToken);
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", mockGeneratedRefreshToken, {
        maxAge: parseTokenExpTimeToMs(config.jwt.refreshToken.expiresIn),
        httpOnly: true
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          accessToken: mockGeneratedAccessToken,
          user: UserMapper.getInstance().map(mockUser)
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockVerify.mockRejectedValue(mockError);
      const req = mockRequestObject<VerifyPayload>({
        headers: mockHeaders,
        body: {
          verificationCode: "7890"
        }
      });

      await authController.verify(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockVerify).toHaveBeenCalledWith(req.body, mockTokenPayload.id);
      expect(mockGenerateTokens).not.toHaveBeenCalled();
      expect(mockSaveToken).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("login tests", () => {
    it("should login user,set refreshToken to cookies and send access token and user as a success response", async () => {
      const req = mockRequestObject<LoginPayload>({
        headers: mockHeaders,
        body: {
          login: "login123",
          password: "password12"
        }
      });

      await authController.login(req, res, mockNextFunction);

      expect(mockLogin).toHaveBeenCalledWith(req.body);
      expect(mockVerifyToken).toHaveBeenCalledWith({
        token: mockUser.token?.refreshToken ?? "",
        tokenType: "refreshToken"
      });
      expect(mockGenerateTokens).toHaveBeenCalledWith(mockTokenPayload, true);
      expect(mockSaveToken).not.toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", mockUser.token.refreshToken, {
        maxAge: parseTokenExpTimeToMs(config.jwt.refreshToken.expiresIn),
        httpOnly: true
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          accessToken: mockGeneratedAccessToken,
          user: UserMapper.getInstance().map(mockUser)
        })
      );
    });

    it("should generate and save new refresh token if current one is expired, set refreshToken to cookies and send access token and user as a success response", async () => {
      mockVerifyToken.mockRejectedValueOnce(new Error("error"));
      const req = mockRequestObject<LoginPayload>({
        headers: mockHeaders,
        body: {
          login: "login123",
          password: "password12"
        }
      });

      await authController.login(req, res, mockNextFunction);

      expect(mockLogin).toHaveBeenCalledWith(req.body);
      expect(mockVerifyToken).toHaveBeenCalledWith({
        token: mockUser.token?.refreshToken ?? "",
        tokenType: "refreshToken"
      });
      expect(mockGenerateTokens).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.nickname
      });
      expect(mockSaveToken).toHaveBeenCalledWith(mockUser.id, mockGeneratedRefreshToken);
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", mockGeneratedRefreshToken, {
        maxAge: parseTokenExpTimeToMs(config.jwt.refreshToken.expiresIn),
        httpOnly: true
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          accessToken: mockGeneratedAccessToken,
          user: UserMapper.getInstance().map(mockUser)
        })
      );
    });

    it("should pass request to error handler if error occurred during saving token", async () => {
      const mockError = new Error("error");
      mockVerifyToken.mockRejectedValueOnce(mockError);
      mockSaveToken.mockRejectedValueOnce(mockError);
      const req = mockRequestObject<LoginPayload>({
        headers: mockHeaders,
        body: {
          login: "login123",
          password: "password12"
        }
      });

      await authController.login(req, res, mockNextFunction);

      expect(mockLogin).toHaveBeenCalledWith(req.body);
      expect(mockVerifyToken).toHaveBeenCalledWith({
        token: mockUser.token?.refreshToken ?? "",
        tokenType: "refreshToken"
      });
      expect(mockGenerateTokens).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.nickname
      });
      expect(mockSaveToken).toHaveBeenCalledWith(mockUser.id, mockGeneratedRefreshToken);
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });

    it("should pass request to error handler if user not found", async () => {
      const mockError = new APIError("Not found", 404);
      mockLogin.mockRejectedValueOnce(mockError);
      const req = mockRequestObject<LoginPayload>({
        headers: mockHeaders,
        body: {
          login: "login123",
          password: "password12"
        }
      });

      await authController.login(req, res, mockNextFunction);

      expect(mockLogin).toHaveBeenCalledWith(req.body);
      expect(mockVerifyToken).not.toHaveBeenCalled();
      expect(mockGenerateTokens).not.toHaveBeenCalled();
      expect(mockSaveToken).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("refresh tests", () => {
    it("should refresh accessToken and send it as a success response", async () => {
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await authController.refresh(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(req.headers.authorization ?? ""));
      expect(mockGetUserById).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(mockVerifyToken).toHaveBeenCalledWith({
        token: mockUser?.token?.refreshToken ?? "",
        tokenType: "refreshToken"
      });
      expect(mockGenerateTokens).toHaveBeenCalledWith(mockTokenPayload, true);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(generateResponse({ accessToken: mockGeneratedAccessToken }));
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new Error("");
      mockGetUserById.mockRejectedValueOnce(mockError);
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await authController.refresh(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(req.headers.authorization ?? ""));
      expect(mockGetUserById).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(mockVerifyToken).not.toHaveBeenCalled();
      expect(mockGenerateTokens).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("resendVerification tests", () => {
    it("should resend verification and send success response", async () => {
      const mockError = new Error("");
      mockGetUserById.mockRejectedValueOnce(mockError);
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await authController.resendVerification(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(req.headers.authorization ?? ""));
      expect(mockResendVerification).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(mockWorker).toHaveBeenCalledWith("./src/workers/VerificationEmailWorker/index.cjs", {
        workerData: {
          email: mockTokenPayload.email,
          code: mockResentVerificationCode
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(generateResponse());
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new Error("");
      mockResendVerification.mockRejectedValueOnce(mockError);
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await authController.resendVerification(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(req.headers.authorization ?? ""));
      expect(mockResendVerification).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(mockWorker).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("logout tests", () => {
    it("should logout and send success response", async () => {
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await authController.logout(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(req.headers.authorization ?? ""));
      expect(mockRemoveToken).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(generateResponse());
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new Error("");
      mockRemoveToken.mockRejectedValueOnce(mockError);
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await authController.logout(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(req.headers.authorization ?? ""));
      expect(mockRemoveToken).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(res.clearCookie).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });
});
