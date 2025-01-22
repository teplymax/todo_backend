import { mockNextFunction, mockRequestObject, mockResponseObject } from "@__mocks__/requestHandler";
import { Category } from "@db/entities/Category.entity";
import { User } from "@db/entities/User.entity";
import { CategoryMapper } from "@services/categoryService/category.mapper";
import { CategoryIdParams, CreateCategoryPayload, EditCategoryPayload } from "@typeDeclarations/category";
import { TokenPayload } from "@typeDeclarations/token";
import { generateResponse } from "@utils/common/generateResponse";
import { APIError } from "@utils/errors/apiError";
import { extractTokenFromAuthHeader } from "@utils/stringUtils";

const res = mockResponseObject();

const mockTokenPayload: TokenPayload = {
  id: "userId",
  nickname: "nickname",
  email: "email"
};

const mockUser = {
  id: "id",
  nickname: "nickname",
  email: "email",
  verificationCode: "1234",
  token: {
    refreshToken: "refreshToken"
  }
} as User;

const mockCategory = {
  id: "id",
  name: "name"
} as Category;

const mockHeaders = {
  authorization: "Bearer token"
};

const mockDecodeToken = jest.fn().mockReturnValue(mockTokenPayload);
jest.mock("@services/tokenService", () => ({
  TokenServiceSingleton: {
    getInstance: () => ({
      decodeToken: mockDecodeToken
    })
  }
}));

const mockGetUserById = jest.fn().mockResolvedValue(mockUser);
jest.mock("@services/userService", () => ({
  UserServiceSingleton: {
    getInstance: () => ({
      getUserById: mockGetUserById
    })
  }
}));

const mockGetCategories = jest.fn().mockResolvedValue([mockCategory]);
const mockCreateCategory = jest.fn().mockResolvedValue({ ...mockCategory, user: mockUser });
const mockEditCategory = jest.fn();
const mockDeleteCategory = jest.fn().mockImplementation((id) => id);
jest.mock("@services/categoryService", () => ({
  CategoryServiceSingleton: {
    getInstance: () => ({
      getCategories: mockGetCategories,
      createCategory: mockCreateCategory,
      editCategory: mockEditCategory,
      deleteCategory: mockDeleteCategory
    })
  }
}));

const { categoryController } = await import("@controllers/CategoryController/index");

describe("CategoryController tests", () => {
  afterEach(jest.clearAllMocks);

  describe("getCategories tests", () => {
    it("should get categories and send them as a success response", async () => {
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await categoryController.getCategories(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockGetCategories).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          categories: [mockCategory]
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockGetCategories.mockRejectedValue(mockError);
      const req = mockRequestObject({
        headers: mockHeaders
      });

      await categoryController.getCategories(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockGetCategories).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("createCategory tests", () => {
    it("should create category and send it as a success response", async () => {
      const req = mockRequestObject<CreateCategoryPayload>({
        headers: mockHeaders,
        body: {
          name: "name"
        }
      });

      await categoryController.createCategory(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockGetUserById).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(mockCreateCategory).toHaveBeenCalledWith(req.body, mockUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          category: CategoryMapper.getInstance().map({ ...mockCategory, user: mockUser })
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockCreateCategory.mockRejectedValue(mockError);
      const req = mockRequestObject<CreateCategoryPayload>({
        headers: mockHeaders,
        body: {
          name: "name"
        }
      });

      await categoryController.createCategory(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockGetUserById).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(mockCreateCategory).toHaveBeenCalledWith(req.body, mockUser);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("editCategory tests", () => {
    it("should edit category and send it as a success response", async () => {
      const mockUpdatedCategory = {
        ...mockCategory,
        name: "new name"
      };
      mockEditCategory.mockResolvedValue(mockUpdatedCategory);
      const req = mockRequestObject<EditCategoryPayload, CategoryIdParams>({
        headers: mockHeaders,
        body: {
          name: "new name"
        },
        params: {
          categoryId: mockCategory.id
        }
      });

      await categoryController.editCategory(req, res, mockNextFunction);

      expect(mockEditCategory).toHaveBeenCalledWith(req.body, mockCategory.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          category: CategoryMapper.getInstance().map({ ...mockUpdatedCategory, user: mockUser })
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockEditCategory.mockRejectedValue(mockError);
      const req = mockRequestObject<EditCategoryPayload, CategoryIdParams>({
        headers: mockHeaders,
        body: {
          name: "new name"
        },
        params: {
          categoryId: mockCategory.id
        }
      });

      await categoryController.editCategory(req, res, mockNextFunction);

      expect(mockEditCategory).toHaveBeenCalledWith(req.body, mockCategory.id);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("deleteCategory tests", () => {
    it("should delete category and send it's id as a success response", async () => {
      const req = mockRequestObject<unknown, CategoryIdParams>({
        headers: mockHeaders,
        params: {
          categoryId: mockCategory.id
        }
      });

      await categoryController.deleteCategory(req, res, mockNextFunction);

      expect(mockDeleteCategory).toHaveBeenCalledWith(mockCategory.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          categoryId: mockCategory.id
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockDeleteCategory.mockRejectedValue(mockError);
      const req = mockRequestObject<unknown, CategoryIdParams>({
        headers: mockHeaders,
        params: {
          categoryId: mockCategory.id
        }
      });

      await categoryController.deleteCategory(req, res, mockNextFunction);

      expect(mockDeleteCategory).toHaveBeenCalledWith(mockCategory.id);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });
});
