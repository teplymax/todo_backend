import { Todo } from "@db/entities/Todo.entity";

import { TodoMapper } from "../todo.mapper";

describe("TodoMapper tests", () => {
  it("should return single instance of mapper", () => {
    const firstCall = TodoMapper.getInstance();
    const secondCall = TodoMapper.getInstance();

    expect(firstCall).toBeInstanceOf(TodoMapper);
    expect(secondCall).toBeInstanceOf(TodoMapper);
    expect(secondCall).toEqual(firstCall);
  });

  it("should map todo correctly", () => {
    const originalTodo = {
      title: "title",
      id: "id",
      user: {
        id: "userId",
        verificationCode: "verificationCode",
        password: "password",
        token: "token"
      }
    } as unknown as Todo;

    const result = TodoMapper.getInstance().map(originalTodo);

    expect(result).toEqual({
      title: "title",
      id: "id"
    });
  });
});
