import { UserServiceSingleton } from "@services/userService";
import { UserService } from "@services/userService/index.service";

describe("UserServiceSingleton tests", () => {
  it("should return one instance of UserService", () => {
    const firstCall = UserServiceSingleton.getInstance();
    const secondCall = UserServiceSingleton.getInstance();

    expect(firstCall).toBeInstanceOf(UserService);
    expect(secondCall).toBeInstanceOf(UserService);
    expect(secondCall).toEqual(firstCall);
  });
});
