import { LessThan } from "typeorm";

import { mockDB } from "@__mocks__/db";
import { User } from "@db/entities/User.entity";
import { EditUserAccountPayload } from "@typeDeclarations/user";
import { APIError } from "@utils/errors/apiError";

import { UserServiceInterface } from "../index.interface";

const { mockFindOne, mockFind, mockRemove, mockUpdate } = mockDB();

const { db } = await import("@db");
const { UserService } = await import("../index.service");

const mockUser = {
  id: "userId",
  name: "name",
  nickname: "nickname",
  birthdayDate: new Date("01.01.2000")
} as unknown as User;

describe("UserService tests", () => {
  let service: UserServiceInterface;

  beforeAll(() => {
    jest.useFakeTimers();
    service = new UserService();
  });

  afterAll(jest.useRealTimers);

  afterEach(jest.clearAllMocks);

  describe("getUserById tests", () => {
    it("should return user correctly", async () => {
      mockFindOne.mockResolvedValue(mockUser);

      const result = service.getUserById(mockUser.id);

      await expect(result).resolves.toEqual(mockUser);
      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockUser.id }, relations: ["token"] });
    });

    it("should throw APIError if user is not found", async () => {
      mockFindOne.mockResolvedValue(null);

      const result = service.getUserById(mockUser.id);

      await expect(result).rejects.toThrow(new APIError("User not found by given Id", 404));
      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockUser.id }, relations: ["token"] });
    });
  });

  describe("editUser tests", () => {
    it.each([{ name: "newName" }, { name: "newName", birthdayDate: "12.05.2001" }] as EditUserAccountPayload[])(
      "should edit user correctly",
      async (payload) => {
        mockFindOne.mockResolvedValue(mockUser);

        const result = service.editUser(mockUser.id, payload);

        let birthdayDate: Date | undefined = mockUser.birthdayDate;
        if (payload.birthdayDate) {
          birthdayDate = new Date(payload.birthdayDate);
        }

        const updatedUser = {
          ...mockUser,
          ...payload,
          birthdayDate
        };

        await expect(result).resolves.toEqual(updatedUser);
        expect(db.getRepository).toHaveBeenCalledWith(User);
        expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
        expect(mockUpdate).toHaveBeenCalledWith(mockUser.id, updatedUser);
      }
    );

    it("should throw APIError if user is not found", async () => {
      mockFindOne.mockResolvedValue(null);

      const result = service.editUser(mockUser.id, { name: "newName" });

      await expect(result).rejects.toThrow(new APIError("User not found by given Id", 404));
      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("deleteUser tests", () => {
    it("should delete user correctly", async () => {
      mockFindOne.mockResolvedValue(mockUser);

      const result = service.deleteUser(mockUser.id);

      await expect(result).resolves.not.toBeDefined();
      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(mockRemove).toHaveBeenCalledWith(mockUser);
    });

    it("should throw APIError if user is not found", async () => {
      mockFindOne.mockResolvedValue(null);

      const result = service.deleteUser(mockUser.id);

      await expect(result).rejects.toThrow(new APIError("User not found by given Id", 404));
      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(mockRemove).not.toHaveBeenCalled();
    });
  });

  describe("deleteUnverifiedUsers tests", () => {
    it("should delete unverified user that were registered more than 24 hours ago", async () => {
      const users = [mockUser];
      mockFind.mockResolvedValue(users);

      await service.deleteUnverifiedUsers();

      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFind).toHaveBeenCalledWith({
        where: {
          verified: false,
          registrationDate: LessThan(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))
        }
      });
      expect(mockRemove).toHaveBeenCalledWith(users);
    });

    it("should do nothing if users were not found", async () => {
      mockFind.mockResolvedValueOnce([]);

      await service.deleteUnverifiedUsers();

      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFind).toHaveBeenCalledWith({
        where: {
          verified: false,
          registrationDate: LessThan(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))
        }
      });
      expect(mockRemove).not.toHaveBeenCalled();
    });
  });
});
