import { mockDB } from "@__mocks__/db";

mockDB();

const mockAuthRouter = jest.fn();
jest.mock("@routes/auth.router", () => ({
  default: mockAuthRouter
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
  it("should register /helloWorld route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith("/helloWorld", expect.any(Function), expect.any(Function));
  });

  it("should register /auth route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockUse).toHaveBeenCalledWith("/auth", mockAuthRouter);
  });
});
