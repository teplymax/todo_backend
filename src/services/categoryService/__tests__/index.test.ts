import { mockDB } from "@__mocks__/db";

mockDB();

const { CategoryServiceSingleton } = await import("..");
const { CategoryService } = await import("../index.service");

describe("CategoryServiceSingleton tests", () => {
  it("should return same instance of CategoryService", () => {
    const firstCall = CategoryServiceSingleton.getInstance();
    const secondCall = CategoryServiceSingleton.getInstance();

    expect(firstCall).toBeInstanceOf(CategoryService);
    expect(secondCall).toBeInstanceOf(CategoryService);
    expect(secondCall).toEqual(firstCall);
  });
});
