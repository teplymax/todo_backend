import { mockDB } from "@__mocks__/db";
import config from "@config";
import { Token } from "@db/entities/Token.entity";
import { TokenPayload, TokenType } from "@typeDeclarations/token";
import { APIError } from "@utils/errors/apiError";

import { TokenServiceInterface } from "../index.interface";

const mockSign = jest.fn();
const mockVerify = jest.fn();
const mockDecode = jest.fn();
jest.mock("jsonwebtoken", () => ({
  default: {
    sign: mockSign,
    verify: mockVerify,
    decode: mockDecode
  }
}));

const { mockCreate, mockFindOne, mockRemove, mockSave } = mockDB();

const { db } = await import("@db");
const { TokenService } = await import("../index.service");

const mockTokenPayload: TokenPayload = {
  nickname: "nickname",
  id: "id",
  email: "email"
};

const mockSignedToken = "mockSignedToken";

const mockUserId = "mockUserId";

const mockTokenEntity = {
  id: "id",
  refreshToken: "refreshToken"
} as unknown as Token;

describe("TokenService tests", () => {
  let service: TokenServiceInterface;

  beforeAll(() => {
    mockSign.mockReturnValue(mockSignedToken);
    mockDecode.mockReturnValue(mockTokenPayload);
    service = new TokenService();
  });

  afterEach(jest.clearAllMocks);

  describe("generateTokens tests", () => {
    it("generateTokens should generate only access token correctly", () => {
      const tokenConfig = config.jwt.accessToken;

      const result = service.generateTokens(mockTokenPayload, true);

      expect(mockSign).toHaveBeenCalledWith(mockTokenPayload, tokenConfig.secret, {
        expiresIn: tokenConfig.expiresIn
      });
      expect(result).toEqual({
        accessToken: mockSignedToken
      });
    });

    it("generateTokens should generate access and refresh tokens correctly", () => {
      const accessTokenConfig = config.jwt.accessToken;
      const refreshTokenConfig = config.jwt.accessToken;

      const result = service.generateTokens(mockTokenPayload);

      const accessTokenSigningCall = mockSign.mock.calls[0];
      const refreshTokenSigningCall = mockSign.mock.calls[0];

      //access token assertions
      expect(accessTokenSigningCall[0]).toEqual(mockTokenPayload);
      expect(accessTokenSigningCall[1]).toEqual(accessTokenConfig.secret);
      expect(accessTokenSigningCall[2]).toEqual({
        expiresIn: accessTokenConfig.expiresIn
      });
      //refresh token assertions
      expect(refreshTokenSigningCall[0]).toEqual(mockTokenPayload);
      expect(refreshTokenSigningCall[1]).toEqual(refreshTokenConfig.secret);
      expect(refreshTokenSigningCall[2]).toEqual({
        expiresIn: refreshTokenConfig.expiresIn
      });
      //output
      expect(result).toEqual({
        accessToken: mockSignedToken,
        refreshToken: mockSignedToken
      });
    });
  });

  describe("verifyToken tests", () => {
    type Callback = (error: unknown, decoded: TokenPayload | null) => void;

    function mockJwtVerify(error: unknown, decoded: TokenPayload | null) {
      mockVerify.mockImplementation((_token, _secret, callback: Callback) => {
        callback(error, decoded);
      });
    }

    it.each(["accessToken", "refreshToken"] as Array<TokenType>)(
      "verifyToken should verify token correctly",
      async (tokenType) => {
        const expectedSecret = config.jwt[tokenType].secret;
        mockJwtVerify(null, mockTokenPayload);

        const result = service.verifyToken({ tokenType, token: mockSignedToken });

        await expect(result).resolves.toEqual(mockTokenPayload);
        expect(mockVerify).toHaveBeenCalledWith(mockSignedToken, expectedSecret, expect.any(Function));
      }
    );

    it.each([
      //Error occurred
      {
        error: {
          message: "error occurred"
        },
        decoded: mockTokenPayload
      },
      //There is no result decoded
      {
        error: null,
        decoded: null
      }
    ])("verifyToken should reject correctly", async ({ decoded, error }) => {
      mockJwtVerify(error, decoded);

      const result = service.verifyToken({ tokenType: "accessToken", token: mockSignedToken });

      await expect(result).rejects.toThrow(new APIError("Invalid token.", 401, error?.message));
    });
  });

  it("decodeToken should decode token properly", () => {
    const result = service.decodeToken(mockSignedToken);

    expect(mockDecode).toHaveBeenCalledWith(mockSignedToken);
    expect(result).toEqual(mockTokenPayload);
  });

  describe("saveToken tests", () => {
    it("saveToken should update existing entity if one found", async () => {
      const tokenEntity = { ...mockTokenEntity };
      mockFindOne.mockResolvedValueOnce(tokenEntity);

      const result = await service.saveToken(mockUserId, mockSignedToken);

      expect(db.getRepository).toHaveBeenCalledWith(Token);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          user: {
            id: mockUserId
          }
        }
      });

      tokenEntity.refreshToken = mockSignedToken;
      expect(mockSave).toHaveBeenCalledWith(tokenEntity);
      expect(result).toEqual(tokenEntity);
    });

    it("saveToken should create and save new entity if it's not found", async () => {
      mockFindOne.mockResolvedValueOnce(null);
      mockCreate.mockReturnValueOnce(mockTokenEntity);

      const result = await service.saveToken(mockUserId, mockSignedToken);

      expect(db.getRepository).toHaveBeenCalledWith(Token);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          user: {
            id: mockUserId
          }
        }
      });
      expect(mockCreate).toHaveBeenCalledWith({
        refreshToken: mockSignedToken,
        user: {
          id: mockUserId
        }
      });
      expect(mockSave).toHaveBeenCalledWith(mockTokenEntity);
      expect(result).toEqual(mockTokenEntity);
    });
  });

  describe("removeToken tests", () => {
    it("removeToken should remove existing entity if one found", async () => {
      mockFindOne.mockResolvedValueOnce(mockTokenEntity);

      await service.removeToken(mockUserId);

      expect(db.getRepository).toHaveBeenCalledWith(Token);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          user: {
            id: mockUserId
          }
        }
      });
      expect(mockRemove).toHaveBeenLastCalledWith(mockTokenEntity);
    });

    it("removeToken should do nothing if entity is not found", async () => {
      mockFindOne.mockResolvedValueOnce(null);

      await service.removeToken(mockUserId);

      expect(db.getRepository).toHaveBeenCalledWith(Token);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          user: {
            id: mockUserId
          }
        }
      });
      expect(mockRemove).not.toHaveBeenCalled();
    });
  });
});
