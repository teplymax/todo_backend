import { mockNextFunction, mockRequestObject, mockResponseObject } from "@__mocks__/requestHandler";
import { Category } from "@db/entities/Category.entity";
import { Todo } from "@db/entities/Todo.entity";
import { User } from "@db/entities/User.entity";
import { TodoMapper } from "@services/todoService/todo.mapper";
import { PaginationResult } from "@typeDeclarations/common";
import { CreateTodoPayload, EditTodoPayload, GetTodosResponse, TodoIdParams } from "@typeDeclarations/todo";
import { TokenPayload } from "@typeDeclarations/token";
import { generateResponse } from "@utils/common/generateResponse";
import { APIError } from "@utils/errors/apiError";
import { extractTokenFromAuthHeader, parsePaginationQueryParams } from "@utils/stringUtils";

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

const mockTodo = {
  id: "id",
  title: "title",
  description: "description"
} as Todo;

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

const mockGetCategoriesByIds = jest.fn().mockResolvedValue([mockCategory]);
jest.mock("@services/categoryService", () => ({
  CategoryServiceSingleton: {
    getInstance: () => ({
      getCategoriesByIds: mockGetCategoriesByIds
    })
  }
}));

const mockGetTodoById = jest.fn().mockResolvedValue(mockTodo);
const mockGetTodos = jest.fn().mockResolvedValue([mockTodo]);
const mockCreateTodo = jest.fn().mockResolvedValue({ ...mockTodo, user: mockUser });
const mockEditTodo = jest.fn();
const mockDeleteTodo = jest.fn().mockImplementation((id) => id);
jest.mock("@services/todoService", () => ({
  TodoServiceSingleton: {
    getInstance: () => ({
      getTodoById: mockGetTodoById,
      getTodos: mockGetTodos,
      createTodo: mockCreateTodo,
      editTodo: mockEditTodo,
      deleteTodo: mockDeleteTodo
    })
  }
}));

const { todoController } = await import("@controllers/TodoController/index");

describe("TodoController tests", () => {
  afterEach(jest.clearAllMocks);

  describe("getTodo tests", () => {
    it("should get todo by id and send it as a success response", async () => {
      const req = mockRequestObject<unknown, TodoIdParams>({
        headers: mockHeaders,
        params: {
          todoId: mockTodo.id
        }
      });

      await todoController.getTodo(req, res, mockNextFunction);

      expect(mockGetTodoById).toHaveBeenCalledWith(mockTodo.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          todo: TodoMapper.getInstance().map({ ...mockTodo, user: mockUser })
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockGetTodoById.mockRejectedValue(mockError);
      const req = mockRequestObject<unknown, TodoIdParams>({
        headers: mockHeaders,
        params: {
          todoId: mockTodo.id
        }
      });

      await todoController.getTodo(req, res, mockNextFunction);

      expect(mockGetTodoById).toHaveBeenCalledWith(mockTodo.id);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getTodos tests", () => {
    const query = {
      limit: "1",
      page: "2"
    };

    it.each([
      {
        currentPage: 1,
        nextPage: 2,
        prevPage: null,
        total: 20,
        data: [mockTodo]
      },
      [mockTodo]
    ] as (PaginationResult<Todo[]> | Todo[])[])(
      "should get todos and send them as a success response",
      async (result) => {
        mockGetTodos.mockResolvedValue(result);
        let expectedResponse: GetTodosResponse;

        if (Array.isArray(result)) {
          expectedResponse = {
            todos: result.map(TodoMapper.getInstance().map)
          };
        } else {
          const { data, ...metadata } = result;
          expectedResponse = {
            data: data.map(TodoMapper.getInstance().map),
            ...metadata
          };
        }

        const req = mockRequestObject({
          headers: mockHeaders,
          query
        });

        await todoController.getTodos(req, res, mockNextFunction);

        expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
        expect(mockGetTodos).toHaveBeenCalledWith(mockTokenPayload.id, parsePaginationQueryParams(query));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(generateResponse(expectedResponse));
      }
    );

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockGetTodos.mockRejectedValue(mockError);
      const req = mockRequestObject({
        headers: mockHeaders,
        query
      });

      await todoController.getTodos(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockGetTodos).toHaveBeenCalledWith(mockTokenPayload.id, parsePaginationQueryParams(query));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("createTodo tests", () => {
    it.each([
      {
        title: "new title",
        description: " new description"
      },
      {
        title: "new title",
        description: " new description",
        categories: [mockCategory.id]
      }
    ] as CreateTodoPayload[])("should create todo and send it as a success response", async (body) => {
      const req = mockRequestObject<CreateTodoPayload>({
        headers: mockHeaders,
        body
      });

      await todoController.createTodo(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockGetUserById).toHaveBeenCalledWith(mockTokenPayload.id);
      if (body.categories) {
        expect(mockGetCategoriesByIds).toHaveBeenCalledWith(mockTokenPayload.id, body.categories);
      }
      expect(mockCreateTodo).toHaveBeenCalledWith(req.body, mockUser, body.categories ? [mockCategory] : undefined);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          todo: TodoMapper.getInstance().map({ ...mockTodo, user: mockUser })
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockCreateTodo.mockRejectedValue(mockError);
      const req = mockRequestObject<CreateTodoPayload>({
        headers: mockHeaders,
        body: {
          title: "new title",
          description: " new description"
        }
      });

      await todoController.createTodo(req, res, mockNextFunction);

      expect(mockDecodeToken).toHaveBeenCalledWith(extractTokenFromAuthHeader(mockHeaders.authorization));
      expect(mockGetUserById).toHaveBeenCalledWith(mockTokenPayload.id);
      expect(mockCreateTodo).toHaveBeenCalledWith(req.body, mockUser, undefined);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("editTodo tests", () => {
    it.each([
      {
        title: "new title",
        description: " new description"
      },
      {
        title: "new title",
        description: " new description",
        categories: [mockCategory.id]
      }
    ] as EditTodoPayload[])("should edit todo and send it as a success response", async (body) => {
      const mockUpdatedTodo = { ...mockTodo, ...body, categories: body.categories ? [mockCategory] : [] };
      mockEditTodo.mockResolvedValue(mockUpdatedTodo);
      const req = mockRequestObject<EditTodoPayload, TodoIdParams>({
        headers: mockHeaders,
        body,
        params: {
          todoId: mockTodo.id
        }
      });

      await todoController.editTodo(req, res, mockNextFunction);

      if (body.categories) {
        expect(mockGetCategoriesByIds).toHaveBeenCalledWith(mockTokenPayload.id, body.categories);
      }
      expect(mockEditTodo).toHaveBeenCalledWith(req.body, mockTodo.id, body.categories ? [mockCategory] : undefined);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          todo: TodoMapper.getInstance().map({ ...mockUpdatedTodo, user: mockUser })
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockEditTodo.mockRejectedValue(mockError);
      const req = mockRequestObject<EditTodoPayload, TodoIdParams>({
        headers: mockHeaders,
        body: {
          title: "new title",
          description: " new description"
        },
        params: {
          todoId: mockTodo.id
        }
      });

      await todoController.editTodo(req, res, mockNextFunction);

      expect(mockEditTodo).toHaveBeenCalledWith(req.body, mockTodo.id, undefined);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe("deleteTodo tests", () => {
    it("should delete todo and send it's id as a success response", async () => {
      const req = mockRequestObject<unknown, TodoIdParams>({
        headers: mockHeaders,
        params: {
          todoId: mockTodo.id
        }
      });

      await todoController.deleteTodo(req, res, mockNextFunction);

      expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodo.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        generateResponse({
          todoId: mockTodo.id
        })
      );
    });

    it("should pass request to error handler if error occurred", async () => {
      const mockError = new APIError("Error", 400);
      mockDeleteTodo.mockRejectedValue(mockError);
      const req = mockRequestObject<unknown, TodoIdParams>({
        headers: mockHeaders,
        params: {
          todoId: mockTodo.id
        }
      });

      await todoController.deleteTodo(req, res, mockNextFunction);

      expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodo.id);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNextFunction).toHaveBeenCalledWith(mockError);
    });
  });
});
