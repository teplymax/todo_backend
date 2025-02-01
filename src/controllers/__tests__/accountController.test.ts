import { mockNextFunction, mockRequestObject, mockResponseObject } from "@__mocks__/requestHandler";
import { User } from "@db/entities/User.entity";
import { UserMapper } from "@services/userService/user.mapper";
import { TokenPayload } from "@typeDeclarations/token";
import { EditUserAccountPayload } from "@typeDeclarations/user";
import { generateResponse } from "@utils/common/generateResponse";
import { APIError } from "@utils/errors/apiError";
import { extractTokenFromAuthHeader } from "@utils/stringUtils";

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

const mockHeaders = {
  authorization: "Bearer token"
};

const mockDecodeToken = jest.fn().mockReturnValue(mockTokenPayload);
jest.mock("@services/tokenService", () => ({
  TokenServiceSingleton: {
    getInstance: () => ({
      decodeToken: mockDecodeToken
    })
  }
}));

const mockGetUserById = jest.fn().mockResolvedValue(mockUser);
const mockEditUser = jest.fn().mockResolvedValue(mockUser);
const mockDeleteUser = jest.fn();
jest.mock("@services/userService", () => ({
  UserServiceSingleton: {
    getInstance: () => ({
      getUserById: mockGetUserById,
      editUser: mockEditUser,
      deleteUser: mockDeleteUser
    })
  }
}));

const { accountController } = await import("@controllers/AccountController/index");

describe("AccountController tests", () => {
  afterEach(jest.clearAllMocks);

  describe("getAccount tests", () => {
    it("should get account and send it as a success response", async () => {
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await accountController.getAccount(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockGetUserById).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          user: UserMapper.getInstance().map(mockUser)
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockGetUserById.mockRejectedValueOnce(mockError);
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await accountController.getAccount(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockGetUserById).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("editAccount tests", () => {
    it("should edit account and send updated data as a response", async () => {
      const req = mockRequestObject<EditUserAccountPayload>({
        headers: mockHeaders,
        body: {
          name: "newName"
        }
      });

      await accountController.editAccount(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockEditUser).toHaveBeenCalledWith(mockTokenPayload.id, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          user: UserMapper.getInstance().map(mockUser)
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockEditUser.mockRejectedValueOnce(mockError);
      const req = mockRequestObject({
        headers: mockHeaders,
        body: {
          name: "newName"
        }
      });

      await accountController.editAccount(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockEditUser).toHaveBeenCalledWith(mockTokenPayload.id, req.body);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("deleteAccount tests", () => {
    it("should delete account and success response", async () => {
      const req = mockRequestObject<EditUserAccountPayload>({
        headers: mockHeaders
      });

      await accountController.deleteAccount(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockDeleteUser).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(generateResponse());
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockDeleteUser.mockRejectedValueOnce(mockError);
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await accountController.deleteAccount(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockDeleteUser).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });
});
