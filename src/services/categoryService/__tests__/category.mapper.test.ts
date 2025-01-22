import { Category } from "@db/entities/Category.entity";

import { CategoryMapper } from "../category.mapper";

describe("CategoryMapper tests", () => {
  it("should return single instance of mapper", () => {
    const firstCall = CategoryMapper.getInstance();
    const secondCall = CategoryMapper.getInstance();

    expect(firstCall).toBeInstanceOf(CategoryMapper);
    expect(secondCall).toBeInstanceOf(CategoryMapper);
    expect(secondCall).toEqual(firstCall);
  });

  it("should map category correctly", () => {
    const originalCategory = {
      name: "name",
      id: "id",
      user: {
        id: "userId",
        verificationCode: "verificationCode",
        password: "password",
        token: "token"
      }
    } as unknown as Category;

    const result = CategoryMapper.getInstance().map(originalCategory);

    expect(result).toEqual({
      name: "name",
      id: "id"
    });
  });
});
