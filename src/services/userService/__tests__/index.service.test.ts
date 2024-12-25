import { mockDB } from "@__mocks__/db";
import { User } from "@db/entities/User.entity";
import { APIError } from "@utils/errors/apiError";

import { UserServiceInterface } from "../index.interface";

const { mockFindOne } = mockDB();

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
    service = new UserService();
  });

  afterEach(jest.clearAllMocks);

  it("should return user correctly", async () => {
    mockFindOne.mockResolvedValueOnce(mockUser);

    const result = service.getUserById(mockUser.id);

    expect(db.getRepository).toHaveBeenCalledWith(User);
    expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
    await expect(result).resolves.toEqual(mockUser);
  });

  it("should throw APIError if user is not found", async () => {
    const result = service.getUserById(mockUser.id);

    expect(db.getRepository).toHaveBeenCalledWith(User);
    expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
    await expect(result).rejects.toThrow(new APIError("User not found by given Id", 404));
  });
});
