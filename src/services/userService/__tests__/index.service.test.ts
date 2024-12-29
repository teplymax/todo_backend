import { LessThan } from "typeorm";

import { mockDB } from "@__mocks__/db";
import { User } from "@db/entities/User.entity";
import { APIError } from "@utils/errors/apiError";

import { UserServiceInterface } from "../index.interface";

const { mockFindOne, mockFind, mockRemove } = mockDB();

const { db } = await import("@db");
const { UserService } = await import("../index.service");

const mockUser = {
  id: "userId",
  name: "name",
  nickname: "nickname"
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
      mockFindOne.mockResolvedValueOnce(mockUser);

      const result = service.getUserById(mockUser.id);

      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockUser.id }, relations: ["token"] });
      await expect(result).resolves.toEqual(mockUser);
    });

    it("should throw APIError if user is not found", async () => {
      const result = service.getUserById(mockUser.id);

      expect(db.getRepository).toHaveBeenCalledWith(User);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockUser.id }, relations: ["token"] });
      await expect(result).rejects.toThrow(new APIError("User not found by given Id", 404));
    });
  });

  describe("deleteUnverifiedUsers tests", () => {
    it("should delete unverified user that were registered more than 24 hours ago", async () => {
      const users = [mockUser];
      mockFind.mockResolvedValueOnce(users);

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
