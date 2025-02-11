import { Category } from "@db/entities/Category.entity";
import { CategoryServiceSingleton } from "@services/categoryService";
import { TodoServiceSingleton } from "@services/todoService";
import { TodoMapper } from "@services/todoService/todo.mapper";
import { TokenServiceSingleton } from "@services/tokenService";
import { UserServiceSingleton } from "@services/userService";
import { AppRequestHandler, PaginationQueryParams, ParamsDictionary } from "@typeDeclarations/common";
import {
  TodoIdParams,
  CreateTodoPayload,
  CreateTodoResponse,
  DeleteTodoResponse,
  EditTodoPayload,
  EditTodoResponse,
  GetTodoResponse,
  GetTodosResponse
} from "@typeDeclarations/todo";
import { generateResponse } from "@utils/common/generateResponse";
import { extractTokenFromAuthHeader, parsePaginationQueryParams } from "@utils/stringUtils";

import { TodoControllerInterface } from "./index.interface";

class TodoController implements TodoControllerInterface {
  private getUserId(authorization: string): string {
    const token = extractTokenFromAuthHeader(authorization);

    return TokenServiceSingleton.getInstance().decodeToken(token).id;
  }

  getTodo: AppRequestHandler<GetTodoResponse, unknown, TodoIdParams> = async (req, res, next) => {
    try {
      const todo = await TodoServiceSingleton.getInstance().getTodoById(req.params.todoId);

      res.status(200).json(
        generateResponse({
          todo: TodoMapper.getInstance().map(todo)
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getTodos: AppRequestHandler<GetTodosResponse, unknown, ParamsDictionary, PaginationQueryParams> = async (
    req,
    res,
    next
  ) => {
    try {
      let response: GetTodosResponse;
      const userId = this.getUserId(req.headers.authorization ?? "");
      const pagination = parsePaginationQueryParams(req.query);

      const result = await TodoServiceSingleton.getInstance().getTodos(userId, pagination);

      if (Array.isArray(result)) {
        response = {
          todos: result.map(TodoMapper.getInstance().map)
        };
      } else {
        const { data, ...metadata } = result;
        response = {
          data: data.map(TodoMapper.getInstance().map),
          ...metadata
        };
      }

      res.status(200).json(generateResponse(response));
    } catch (error) {
      next(error);
    }
  };

  createTodo: AppRequestHandler<CreateTodoResponse, CreateTodoPayload> = async (req, res, next) => {
    try {
      const userId = this.getUserId(req.headers.authorization ?? "");
      let categories: Array<Category> | undefined;

      if (req.body.categories) {
        categories = await CategoryServiceSingleton.getInstance().getCategoriesByIds(userId, req.body.categories);
      }

      const user = await UserServiceSingleton.getInstance().getUserById(userId);
      const todo = await TodoServiceSingleton.getInstance().createTodo(req.body, user, categories);

      res.status(201).json(
        generateResponse({
          todo: TodoMapper.getInstance().map(todo)
        })
      );
    } catch (error) {
      next(error);
    }
  };

  editTodo: AppRequestHandler<EditTodoResponse, EditTodoPayload, TodoIdParams> = async (req, res, next) => {
    try {
      const userId = this.getUserId(req.headers.authorization ?? "");
      let categories: Array<Category> | undefined;

      if (req.body.categories) {
        categories = await CategoryServiceSingleton.getInstance().getCategoriesByIds(userId, req.body.categories);
      }

      const todo = await TodoServiceSingleton.getInstance().editTodo(req.body, req.params.todoId, categories);

      res.status(200).json(
        generateResponse({
          todo: TodoMapper.getInstance().map(todo)
        })
      );
    } catch (error) {
      next(error);
    }
  };

  deleteTodo: AppRequestHandler<DeleteTodoResponse, unknown, TodoIdParams> = async (req, res, next) => {
    try {
      const todoId = await TodoServiceSingleton.getInstance().deleteTodo(req.params.todoId);

      res.status(200).json(
        generateResponse({
          todoId
        })
      );
    } catch (error) {
      next(error);
    }
  };
}

export const todoController = new TodoController();
