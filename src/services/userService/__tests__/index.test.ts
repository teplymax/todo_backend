import { UserServiceSingleton } from "..";
import { UserService } from "../index.service";

describe("UserServiceSingleton tests", () => {
  it("should return same instance of UserService", () => {
    const firstCall = UserServiceSingleton.getInstance();
    const secondCall = UserServiceSingleton.getInstance();

    expect(firstCall).toBeInstanceOf(UserService);
    expect(secondCall).toBeInstanceOf(UserService);
    expect(secondCall).toEqual(firstCall);
  });
});
