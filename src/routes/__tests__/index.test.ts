import { mockDB } from "@__mocks__/db";

mockDB();

const mockAuthRouter = jest.fn();
jest.mock("@routes/auth.router", () => ({
  default: mockAuthRouter
}));

const mockCategoryRouter = jest.fn();
jest.mock("@routes/category.router", () => ({
  default: mockCategoryRouter
}));

const mockTodoRouter = jest.fn();
jest.mock("@routes/todo.router", () => ({
  default: mockTodoRouter
}));

const mockGet = jest.fn();
const mockUse = jest.fn();
jest.mock("express", () => ({
  default: {
    Router: jest.fn().mockReturnValue({
      use: mockUse,
      get: mockGet
    })
  }
}));

await import("../index");
const express = await import("express");

describe("Root router tests", () => {
  it("should register /auth route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockUse.mock.calls[0][0]).toEqual("/auth");
    expect(mockUse.mock.calls[0][1]).toEqual(mockAuthRouter);
  });

  it("should register /category route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockUse.mock.calls[1][0]).toEqual("/category");
    expect(mockUse.mock.calls[1][1]).toEqual(mockCategoryRouter);
  });

  it("should register /todo route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockUse.mock.calls[2][0]).toEqual("/todo");
    expect(mockUse.mock.calls[2][1]).toEqual(mockTodoRouter);
  });
});
