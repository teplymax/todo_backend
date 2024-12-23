import { TokenServiceSingleton } from "..";
import { TokenService } from "../index.service";

describe("TokenServiceSingleton tests", () => {
  it("should return same instance of TokenService", () => {
    const firstCall = TokenServiceSingleton.getInstance();
    const secondCall = TokenServiceSingleton.getInstance();

    expect(firstCall).toBeInstanceOf(TokenService);
    expect(secondCall).toBeInstanceOf(TokenService);
    expect(secondCall).toEqual(firstCall);
  });
});
