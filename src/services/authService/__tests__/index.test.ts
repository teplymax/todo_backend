import { AuthServiceSingleton } from "@services/authService";
import { AuthService } from "@services/authService/index.service";

describe("UserServiceSingleton tests", () => {
  it("should return one instance of UserService", () => {
    const firstCall = AuthServiceSingleton.getInstance();
    const secondCall = AuthServiceSingleton.getInstance();

    expect(firstCall).toBeInstanceOf(AuthService);
    expect(secondCall).toBeInstanceOf(AuthService);
    expect(secondCall).toEqual(firstCall);
  });
});
