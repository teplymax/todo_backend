import { mockDB } from "@__mocks__/db";
import { Category } from "@db/entities/Category.entity";
import { User } from "@db/entities/User.entity";
import { APIError } from "@utils/errors/apiError";

import { CategoryServiceInterface } from "../index.interface";

const { mockFindOne, mockFind, mockUpdate, mockRemove, mockSave } = mockDB();

const { db } = await import("@db");
const { CategoryService } = await import("../index.service");

const mockUser = {
  id: "userId",
  nickname: "nickname"
} as unknown as User;

const mockCategory = {
  id: "categoryId",
  name: "name"
} as unknown as Category;

describe("CategoryService tests", () => {
  let service: CategoryServiceInterface;

  beforeAll(() => {
    service = new CategoryService();
  });

  afterEach(jest.clearAllMocks);

  describe("getCategoriesByIds tests", () => {
    it("should return Categories by ids correctly", async () => {
      mockFind.mockResolvedValueOnce([mockCategory, { ...mockCategory, id: "2" }]);

      const result = service.getCategoriesByIds(mockUser.id, [mockCategory.id]);

      expect(db.getRepository).toHaveBeenCalledWith(Category);
      expect(mockFind).toHaveBeenCalledWith({
        where: {
          user: {
            id: mockUser.id
          }
        }
      });
      await expect(result).resolves.toEqual([mockCategory]);
    });
  });

  describe("getCategories tests", () => {
    it("should return Categories correctly", async () => {
      mockFind.mockResolvedValueOnce([mockCategory]);

      const result = service.getCategories(mockUser.id);

      expect(db.getRepository).toHaveBeenCalledWith(Category);
      expect(mockFind).toHaveBeenCalledWith({
        where: {
          user: {
            id: mockUser.id
          }
        }
      });
      await expect(result).resolves.toEqual([mockCategory]);
    });
  });

  describe("createCategory tests", () => {
    it("should create Category correctly", async () => {
      const payload = { name: "name" };
      const mockSavedCategory = { ...payload, id: "mockId", user: mockUser };
      mockSave.mockResolvedValueOnce(mockSavedCategory);

      const result = service.createCategory(payload, mockUser);

      expect(db.getRepository).toHaveBeenCalledWith(Category);
      await expect(result).resolves.toEqual(mockSavedCategory);
      expect(mockSave).toHaveBeenCalledWith({ ...payload, user: mockUser });
    });
  });

  describe("editCategory tests", () => {
    const payload = { name: "name_changed" };

    it("should edit Category correctly", async () => {
      const mockSavedCategory = { ...mockCategory, ...payload };
      mockUpdate.mockResolvedValueOnce(mockSavedCategory);
      mockFindOne.mockResolvedValueOnce(mockCategory);

      const result = service.editCategory(payload, mockCategory.id);

      expect(db.getRepository).toHaveBeenCalledWith(Category);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockCategory.id } });
      await expect(result).resolves.toEqual(mockSavedCategory);
      expect(mockUpdate).toHaveBeenCalledWith(mockCategory.id, { ...mockCategory, ...payload });
    });

    it("should throw APIError if Category is not found", async () => {
      const result = service.editCategory(payload, mockCategory.id);

      expect(db.getRepository).toHaveBeenCalledWith(Category);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockCategory.id } });
      await expect(result).rejects.toThrow(new APIError("Category not found.", 404));
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("deleteCategory tests", () => {
    it("should delete Category correctly", async () => {
      mockFindOne.mockResolvedValueOnce(mockCategory);

      const result = service.deleteCategory(mockCategory.id);

      expect(db.getRepository).toHaveBeenCalledWith(Category);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockCategory.id } });
      await expect(result).resolves.toEqual(mockCategory.id);
      expect(mockRemove).toHaveBeenCalledWith(mockCategory);
    });

    it("should throw APIError if Category is not found", async () => {
      const result = service.deleteCategory(mockCategory.id);

      expect(db.getRepository).toHaveBeenCalledWith(Category);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockCategory.id } });
      await expect(result).rejects.toThrow(new APIError("Category not found.", 404));
      expect(mockRemove).not.toHaveBeenCalled();
    });
  });
});
