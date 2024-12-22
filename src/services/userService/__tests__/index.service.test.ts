// import { UserService } from "../index.service";
import { UserServiceInterface } from "../index.interface";

const mockFindOne = jest.fn();
const mockGetRepository = jest.fn().mockReturnValue({
  findOne: mockFindOne
});

// jest.mock("../../../db", () => ({
//   db: {
//     getRepository: mockGetRepository
//   }
// }));

jest.jestGlobals.unstable_mockModule("@utils/common/generateResponse", () => ({
  generateResponse: mockFindOne
}));

const { generateResponse } = await import("@utils/common/generateResponse");
const { UserService } = await import("../index.service");

describe("UserService tests", () => {
  let service: UserServiceInterface;

  beforeAll(() => {
    service = new UserService();
    (generateResponse as jest.Mock).mockImplementation(() => "mock function!!!");
  });

  it("should return user correctly", async () => {
    const result = service.getUserById("userId");
    expect(mockFindOne).toHaveBeenCalled();

    expect(result).resolves.toEqual(null);
  });

  it("should throw APIError if user ", () => {});
});
