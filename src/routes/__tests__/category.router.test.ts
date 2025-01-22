import { mockDB } from "@__mocks__/db";
import { CategoryControllerInterface } from "@controllers/CategoryController/index.interface";

mockDB();

const mockController: CategoryControllerInterface = {
  getCategories: jest.fn(),
  createCategory: jest.fn(),
  editCategory: jest.fn(),
  deleteCategory: jest.fn()
};
jest.mock("@controllers/CategoryController", () => ({
  categoryController: mockController
}));

const mockCreateCategoryValidator = jest.fn();
const mockEditCategoryValidator = jest.fn();
jest.mock("@middlewares/validation.middleware", () => ({
  validationMiddleware: jest.fn().mockImplementation((validator) => {
    if (validator === "createCategoryValidator") {
      return mockCreateCategoryValidator;
    } else {
      return mockEditCategoryValidator;
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

await import("../category.router");
const express = await import("express");

describe("Category router tests", () => {
  it("should register get / route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith("/", mockAuthMidleware, mockController.getCategories);
  });

  it("should register post / route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith(
      "/",
      mockAuthMidleware,
      mockCreateCategoryValidator,
      mockController.createCategory
    );
  });

  it("should register patch /:categoryId route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockPatch).toHaveBeenCalledWith(
      "/:categoryId",
      mockAuthMidleware,
      mockEditCategoryValidator,
      mockController.editCategory
    );
  });

  it("should register delete /:categoryId route", () => {
    expect(express.default.Router).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith("/:categoryId", mockAuthMidleware, mockController.deleteCategory);
  });
});
