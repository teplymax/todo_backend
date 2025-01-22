import { mockDB } from "@__mocks__/db";
import { TodoControllerInterface } from "@controllers/TodoController/index.interface";

mockDB();

const mockController: TodoControllerInterface = {
  getTodo: jest.fn(),
  getTodos: jest.fn(),
  createTodo: jest.fn(),
  editTodo: jest.fn(),
  deleteTodo: jest.fn()
};
jest.mock("@controllers/TodoController", () => ({
  todoController: mockController
}));

const mockCreateTodoValidator = jest.fn();
const mockEditTodoValidator = jest.fn();
jest.mock("@middlewares/validation.middleware", () => ({
  validationMiddleware: jest.fn().mockImplementation((validator) => {
    if (validator === "createTodoValidator") {
      return mockCreateTodoValidator;
    } else {
      return mockEditTodoValidator;
    }
  })
}));

const mockAuthMidleware = jest.fn();
jest.mock("@middlewares/auth.middleware", () => ({
  authMiddleware: mockAuthMidleware
}));

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPatch = jest.fn();
const mockDelete = jest.fn();
jest.mock("express", () => ({
  default: {
    Router: jest.fn().mockReturnValue({
      get: mockGet,
      post: mockPost,
      patch: mockPatch,
      delete: mockDelete
    })
  }
}));

await import("../todo.router");
const express = await import("express");

describe("Todo router tests", () => {
  it("should register get / route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockGet.mock.calls[0]).toEqual(["/", mockAuthMidleware, mockController.getTodos]);
  });

  it("should register get /:todoId route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockGet.mock.calls[1]).toEqual(["/:todoId", mockAuthMidleware, mockController.getTodo]);
  });

  it("should register post / route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith("/", mockAuthMidleware, mockCreateTodoValidator, mockController.createTodo);
  });

  it("should register patch /:todoId route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPatch).toHaveBeenCalledWith(
      "/:todoId",
      mockAuthMidleware,
      mockEditTodoValidator,
      mockController.editTodo
    );
  });

  it("should register delete /:todoId route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith("/:todoId", mockAuthMidleware, mockController.deleteTodo);
  });
});
