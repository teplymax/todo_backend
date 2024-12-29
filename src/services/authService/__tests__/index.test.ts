import { mockDB } from "@__mocks__/db";

mockDB();

const { AuthServiceSingleton } = await import("..");
const { AuthService } = await import("../index.service");

describe("UserServiceSingleton tests", () => {
  it("should return one instance of UserService", () => {
    const firstCall = AuthServiceSingleton.getInstance();
    const secondCall = AuthServiceSingleton.getInstance();

    expect(firstCall).toBeInstanceOf(AuthService);
    expect(secondCall).toBeInstanceOf(AuthService);
    expect(secondCall).toEqual(firstCall);
  });
});
