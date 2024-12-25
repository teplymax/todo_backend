import { mockDB } from "@__mocks__/db";
import { AuthControllerInterface } from "@controllers/AuthController/index.interface";

mockDB();

const mockController: AuthControllerInterface = {
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  refresh: jest.fn(),
  resendVerification: jest.fn(),
  verify: jest.fn()
};
jest.mock("@controllers/AuthController", () => ({
  authController: mockController
}));

const mockRegisterValidator = jest.fn();
const mockLoginValidator = jest.fn();
jest.mock("@middlewares/validation.middleware", () => ({
  validationMiddleware: jest.fn().mockImplementation((validator) => {
    if (validator === "registerValidator") {
      return mockRegisterValidator;
    } else {
      return mockLoginValidator;
    }
  })
}));

const mockPost = jest.fn();
jest.mock("express", () => ({
  default: {
    Router: jest.fn().mockReturnValue({
      post: mockPost
    })
  }
}));

await import("../auth.router");
const express = await import("express");

describe("Root router tests", () => {
  it("should register /register route", () => {
    expect(express.default.Router).toHaveBeenCalled();
  });

  it("should register /auth route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith("/register", mockRegisterValidator, mockController.register);
  });

  it("should register /verify route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith("/verify", mockController.verify);
  });

  it("should register /resendVerification route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith("/resendVerification", mockController.resendVerification);
  });

  it("should register /login route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith("/login", mockLoginValidator, mockController.login);
  });

  it("should register /logout route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith("/logout", mockController.logout);
  });

  it("should register /refresh route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith("/refresh", mockController.refresh);
  });
});
