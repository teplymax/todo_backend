import { User } from "@db/entities/User.entity";

import { UserMapper } from "../user.mapper";

describe("UserMapper tests", () => {
  it("should return single instance of mapper", () => {
    const firstCall = UserMapper.getInstance();
    const secondCall = UserMapper.getInstance();

    expect(firstCall).toBeInstanceOf(UserMapper);
    expect(secondCall).toBeInstanceOf(UserMapper);
    expect(secondCall).toEqual(firstCall);
  });

  it("should map user correctly", () => {
    const originalUser = {
      id: "userId",
      verificationCode: "verificationCode",
      password: "password",
      token: "token"
    } as unknown as User;

    const result = UserMapper.getInstance().map(originalUser);

    expect(result).toEqual({
      id: "userId"
    });
  });
});
