import { mockDB } from "@__mocks__/db";
import { Category } from "@db/entities/Category.entity";
import { Todo } from "@db/entities/Todo.entity";
import { User } from "@db/entities/User.entity";
import { APIError } from "@utils/errors/apiError";

import { TodoServiceInterface } from "../index.interface";

const { mockFindOne, mockFind, mockRemove, mockSave } = mockDB();

const { db } = await import("@db");
const { TodoService } = await import("../index.service");

const mockTodo = {
  id: "TodoId",
  title: "name",
  description: "nickname"
} as unknown as Todo;

const mockUser = {
  id: "userId",
  nickname: "nickname"
} as unknown as User;

const mockCategory = {
  id: "categoryId",
  name: "name"
} as unknown as Category;

describe("TodoService tests", () => {
  let service: TodoServiceInterface;

  beforeAll(() => {
    service = new TodoService();
  });

  afterEach(jest.clearAllMocks);

  describe("getTodoById tests", () => {
    it("should return Todo correctly", async () => {
      mockFindOne.mockResolvedValueOnce(mockTodo);

      const result = service.getTodoById(mockTodo.id);

      expect(db.getRepository).toHaveBeenCalledWith(Todo);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockTodo.id }, relations: ["categories"] });
      await expect(result).resolves.toEqual(mockTodo);
    });

    it("should throw APIError if Todo is not found", async () => {
      const result = service.getTodoById(mockTodo.id);

      expect(db.getRepository).toHaveBeenCalledWith(Todo);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockTodo.id }, relations: ["categories"] });
      await expect(result).rejects.toThrow(new APIError("Todo not found.", 404));
    });
  });

  describe("getTodos tests", () => {
    it("should return Todos correctly", async () => {
      mockFind.mockResolvedValueOnce([mockTodo]);

      const result = service.getTodos(mockUser.id);

      expect(db.getRepository).toHaveBeenCalledWith(Todo);
      expect(mockFind).toHaveBeenCalledWith({
        where: {
          user: {
            id: mockUser.id
          }
        },
        relations: ["categories"]
      });
      await expect(result).resolves.toEqual([mockTodo]);
    });
  });

  describe("createTodo tests", () => {
    it.each([
      {
        payload: { title: "title", description: "description" }
      },
      {
        payload: { title: "title", description: "description" },
        categories: [mockCategory]
      }
    ])("should create Todo correctly", async ({ payload, categories }) => {
      const mockSavedTodo = { ...payload, id: "mockId", user: mockUser, categories };
      mockSave.mockResolvedValueOnce(mockSavedTodo);

      const result = service.createTodo(payload, mockUser, categories);

      expect(db.getRepository).toHaveBeenCalledWith(Todo);
      expect(mockSave).toHaveBeenCalledWith({ ...payload, categories, user: mockUser });
      await expect(result).resolves.toEqual(mockSavedTodo);
    });
  });

  describe("editTodo tests", () => {
    it.each([
      {
        payload: { description: "description" }
      },
      {
        payload: { title: "title", description: "description" },
        categories: [mockCategory]
      }
    ])("should edit Todo correctly", async ({ payload, categories }) => {
      const mockSavedTodo = { ...mockTodo, ...payload, categories };
      mockSave.mockResolvedValueOnce(mockSavedTodo);
      mockFindOne.mockResolvedValueOnce(mockTodo);

      const result = service.editTodo(payload, mockTodo.id, categories);

      expect(db.getRepository).toHaveBeenCalledWith(Todo);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockTodo.id }, relations: ["categories"] });
      await expect(result).resolves.toEqual(mockSavedTodo);
      expect(mockSave).toHaveBeenCalledWith({ ...mockTodo, ...payload, categories });
    });

    it("should throw APIError if Todo is not found", async () => {
      const result = service.editTodo({ title: "title", description: "description" }, mockTodo.id);

      expect(db.getRepository).toHaveBeenCalledWith(Todo);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockTodo.id }, relations: ["categories"] });
      await expect(result).rejects.toThrow(new APIError("Todo not found.", 404));
      expect(mockSave).not.toHaveBeenCalled();
    });
  });

  describe("deleteTodo tests", () => {
    it("should delete Todo correctly", async () => {
      mockFindOne.mockResolvedValueOnce(mockTodo);

      const result = service.deleteTodo(mockTodo.id);

      expect(db.getRepository).toHaveBeenCalledWith(Todo);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockTodo.id } });
      await expect(result).resolves.toEqual(mockTodo.id);
      expect(mockRemove).toHaveBeenCalledWith(mockTodo);
    });

    it("should throw APIError if Todo is not found", async () => {
      const result = service.deleteTodo(mockTodo.id);

      expect(db.getRepository).toHaveBeenCalledWith(Todo);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: mockTodo.id } });
      await expect(result).rejects.toThrow(new APIError("Todo not found.", 404));
      expect(mockRemove).not.toHaveBeenCalled();
    });
  });
});
