import { mockDB } from "@__mocks__/db";

mockDB();

const { TodoServiceSingleton } = await import("..");
const { TodoService } = await import("../index.service");

describe("TodoServiceSingleton tests", () => {
  it("should return same instance of TodoService", () => {
    const firstCall = TodoServiceSingleton.getInstance();
    const secondCall = TodoServiceSingleton.getInstance();

    expect(firstCall).toBeInstanceOf(TodoService);
    expect(secondCall).toBeInstanceOf(TodoService);
    expect(secondCall).toEqual(firstCall);
  });
});
