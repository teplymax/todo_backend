import { mockDB } from "@__mocks__/db";
import { AccountControllerInterface } from "@controllers/AccountController/index.interface";

mockDB();

const mockController: AccountControllerInterface = {
  getAccount: jest.fn(),
  editAccount: jest.fn(),
  deleteAccount: jest.fn()
};
jest.mock("@controllers/AccountController", () => ({
  accountController: mockController
}));

const mockEditAccountValidator = jest.fn();
jest.mock("@middlewares/validation.middleware", () => ({
  validationMiddleware: jest.fn().mockImplementation((validator) => {
    if (validator === "editAccountValidator") {
      return mockEditAccountValidator;
    }
  })
}));

const mockAuthMidleware = jest.fn();
jest.mock("@middlewares/auth.middleware", () => ({
  authMiddleware: mockAuthMidleware
}));

const mockGet = jest.fn();
const mockPatch = jest.fn();
const mockDelete = jest.fn();
jest.mock("express", () => ({
  default: {
    Router: jest.fn().mockReturnValue({
      get: mockGet,
      patch: mockPatch,
      delete: mockDelete
    })
  }
}));

await import("../account.router");
const express = await import("express");

describe("Account router tests", () => {
  it("should register get / route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith("/", mockAuthMidleware, mockController.getAccount);
  });

  it("should register patch / route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPatch).toHaveBeenCalledWith(
      "/",
      mockAuthMidleware,
      mockEditAccountValidator,
      mockController.editAccount
    );
  });

  it("should register delete / route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith("/", mockAuthMidleware, mockController.deleteAccount);
  });
});
