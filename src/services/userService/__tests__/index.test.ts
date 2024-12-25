import { mockDB } from "@__mocks__/db";

mockDB();

const { UserServiceSingleton } = await import("..");
const { UserService } = await import("../index.service");

describe("UserServiceSingleton tests", () => {
  it("should return same instance of UserService", () => {
    const firstCall = UserServiceSingleton.getInstance();
    const secondCall = UserServiceSingleton.getInstance();

    expect(firstCall).toBeInstanceOf(UserService);
    expect(secondCall).toBeInstanceOf(UserService);
    expect(secondCall).toEqual(firstCall);
  });
});
