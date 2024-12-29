import { mockDB } from "@__mocks__/db";
import { User } from "@db/entities/User.entity";
import { LoginPayload, RegisterPayload } from "@typeDeclarations/auth";
import { APIError } from "@utils/errors/apiError";

import { AuthServiceInterface } from "../index.interface";

const { mockFindOne, mockCreate, mockSave, mockUpdate } = mockDB();

const mockHash = jest.fn().mockImplementation((value) => `${value}_hashed`);
const mockCompare = jest.fn();
jest.mock("bcrypt", () => ({
  default: {
    hash: mockHash,
    compare: mockCompare
  }
}));

jest.mock("@utils/stringUtils", () => ({
  generateVerificationCode: jest.fn()
}));

await import("bcrypt");

const { db } = await import("@db");
const { generateVerificationCode } = await import("@utils/stringUtils");

const { AuthService } = await import("../index.service");

const mockUser = {
  id: "userId",
  name: "name",
  nickname: "nickname",
  email: "email",
  password: "userPassword"
} as unknown as User;
const mockVerificationCode = 1234;

describe("AuthService tests", () => {
  let service: AuthServiceInterface;

  beforeAll(() => {
    (generateVerificationCode as jest.Mock).mockReturnValue(mockVerificationCode);
    service = new AuthService();
  });

  afterEach(jest.clearAllMocks);

  describe("login tests", () => {
    const mockPayload: LoginPayload = {
      login: "login",
      password: "password"
    };

    it("should login user if valid credentials are provided", async () => {
      mockFindOne.mockResolvedValueOnce(mockUser);
      mockCompare.mockResolvedValueOnce(true);

      const result = await service.login(mockPayload);

      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { nickname: mockPayload.login }
      });
      expect(mockCompare).toHaveBeenCalledWith(mockPayload.password, mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if user is not found", async () => {
      mockFindOne.mockResolvedValueOnce(null);

      const result = service.login(mockPayload);

      await expect(result).rejects.toThrow(new APIError("Invalid credentials", 401));
      expect(db.getRepository).toHaveBeenCalledWith(User);

      const findByNickname = mockFindOne.mock.calls[0];
      const findByEmail = mockFindOne.mock.calls[1];

      expect(findByNickname[0]).toEqual({
        where: { nickname: mockPayload.login }
      });
      expect(findByEmail[0]).toEqual({
        where: { email: mockPayload.login }
      });

      expect(mockCompare).not.toHaveBeenCalled();
    });

    it("should throw an error if invalid password provided", async () => {
      mockFindOne.mockResolvedValueOnce(mockUser);
      mockCompare.mockResolvedValueOnce(false);

      const result = service.login(mockPayload);

      await expect(result).rejects.toThrow(new APIError("Invalid credentials", 401));
      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { nickname: mockPayload.login }
      });
      expect(mockCompare).toHaveBeenCalledWith(mockPayload.password, mockUser.password);
    });
  });

  describe("register tests", () => {
    const mockRegisterPayload = {
      id: "userId",
      name: "name",
      nickname: "nickname",
      email: "email",
      password: "password"
    } as unknown as RegisterPayload;

    it.each([
      mockRegisterPayload,
      {
        ...mockRegisterPayload,
        birthdayDate: "04-22-2022"
      }
    ])("should register user correctly if there no user found by nickname or email", async (payload) => {
      mockFindOne.mockResolvedValueOnce(null);
      const expectedUserToCreate = {
        ...payload,
        password: `${payload.password}_hashed`,
        birthdayDate: payload.birthdayDate ? expect.any(Date) : undefined,
        verificationCode: `${mockVerificationCode}_hashed`,
        registrationDate: expect.any(Date),
        verified: false
      };

      const result = await service.register(payload);

      const findUserByNickname = mockFindOne.mock.calls[0];
      const findUserByEmail = mockFindOne.mock.calls[1];

      const hashPassword = mockHash.mock.calls[0];
      const hashVerificationCode = mockHash.mock.calls[1];

      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(generateVerificationCode).toHaveBeenCalled();
      //User exists checks
      expect(mockFindOne).toHaveBeenCalledTimes(2);
      expect(findUserByNickname[0]).toEqual({ where: { nickname: payload.nickname } });
      expect(findUserByEmail[0]).toEqual({ where: { email: payload.email } });
      //Password hashing
      expect(hashPassword[0]).toEqual(payload.password);
      expect(hashPassword[1]).toEqual(10);
      //Verification code hashing
      expect(hashVerificationCode[0]).toEqual(mockVerificationCode.toString());
      expect(hashVerificationCode[1]).toEqual(10);
      //User creation
      expect(mockCreate).toHaveBeenCalledWith(expectedUserToCreate);
      expect(mockSave).toHaveBeenCalledWith(expectedUserToCreate);
      expect(result).toEqual({
        ...expectedUserToCreate,
        verificationCode: mockVerificationCode.toString()
      });
    });

    it("should throw an error if user is found by nickname", async () => {
      mockFindOne.mockResolvedValue(mockUser);

      const result = service.register(mockRegisterPayload);
      await expect(result).rejects.toThrow(new APIError(`User with given nickname already exists`, 409));

      const findUserByNickname = mockFindOne.mock.calls[0];

      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(generateVerificationCode).toHaveBeenCalled();

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(findUserByNickname[0]).toEqual({ where: { nickname: mockRegisterPayload.nickname } });

      expect(mockHash).not.toHaveBeenCalled();
      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
    });

    it("should throw an error if user is found by email", async () => {
      mockFindOne.mockImplementation((matcher) => {
        if (JSON.stringify(matcher).includes("email")) {
          return mockUser;
        } else {
          return null;
        }
      });

      const result = service.register(mockRegisterPayload);
      await expect(result).rejects.toThrow(new APIError(`User with given email already exists`, 409));

      const findUserByNickname = mockFindOne.mock.calls[0];
      const findUserByEmail = mockFindOne.mock.calls[1];

      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(generateVerificationCode).toHaveBeenCalled();

      expect(mockFindOne).toHaveBeenCalledTimes(2);
      expect(findUserByNickname[0]).toEqual({ where: { nickname: mockRegisterPayload.nickname } });
      expect(findUserByEmail[0]).toEqual({ where: { email: mockRegisterPayload.email } });

      expect(mockHash).not.toHaveBeenCalled();
      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
    });
  });

  describe("verify tests", () => {
    const verificationCode = mockVerificationCode.toString();
    const hashedVerificationCode = `${mockVerificationCode.toString()}_hashed`;

    it("should verify user if valid verification code is provided", async () => {
      mockFindOne.mockResolvedValueOnce({ ...mockUser, verificationCode: hashedVerificationCode });
      mockCompare.mockResolvedValueOnce(true);
      const expectedUpdatedUser = {
        ...mockUser,
        verificationCode: null,
        verified: true
      };

      const result = await service.verify({ verificationCode }, mockUser.id);

      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          id: mockUser.id
        }
      });
      expect(mockCompare).toHaveBeenCalledWith(verificationCode, hashedVerificationCode);
      expect(mockUpdate).toHaveBeenCalledWith(mockUser.id, expectedUpdatedUser);
      expect(result).toEqual(expectedUpdatedUser);
    });

    it("should throw an error if there is no user found", async () => {
      mockFindOne.mockResolvedValueOnce(null);

      const result = service.verify({ verificationCode }, mockUser.id);

      await expect(result).rejects.toThrow(new APIError("Verification code expired. User was deleted.", 404));
      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          id: mockUser.id
        }
      });
      expect(mockCompare).not.toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("should throw an error if invalid verifivation code is provided", async () => {
      mockFindOne.mockResolvedValueOnce({ ...mockUser, verificationCode: hashedVerificationCode });
      mockCompare.mockResolvedValueOnce(false);

      const result = service.verify({ verificationCode }, mockUser.id);

      await expect(result).rejects.toThrow(new APIError("Invalid code. Please try again.", 400));
      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          id: mockUser.id
        }
      });
      expect(mockCompare).toHaveBeenCalledWith(verificationCode, hashedVerificationCode);
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("resendVerification tests", () => {
    it("should resend verification code and update user's verification code in db if user found", async () => {
      mockFindOne.mockResolvedValueOnce(mockUser);

      const result = await service.resendVerification(mockUser.id);

      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          id: mockUser.id
        }
      });
      expect(mockHash).toHaveBeenCalledWith(mockVerificationCode.toString(), 10);
      expect(mockUpdate).toHaveBeenCalledWith(mockUser.id, {
        ...mockUser,
        verificationCode: `${mockVerificationCode}_hashed`
      });
      expect(result).toEqual(`${mockVerificationCode}`);
    });

    it("should throw an error if there is no user found", async () => {
      mockFindOne.mockResolvedValueOnce(null);

      const result = service.resendVerification(mockUser.id);

      await expect(result).rejects.toThrow(new APIError("Verification code expired. User was deleted.", 404));
      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          id: mockUser.id
        }
      });
      expect(mockHash).not.toHaveBeenCalled();
    });
  });

  it.todo("TODO: logout tests");
});
