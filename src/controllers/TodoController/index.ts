import { Category } from "@db/entities/Category.entity";
import { CategoryServiceSingleton } from "@services/categoryService";
import { TodoServiceSingleton } from "@services/todoService";
import { TokenServiceSingleton } from "@services/tokenService";
import { UserServiceSingleton } from "@services/userService";
import { AppRequestHandler } from "@typeDeclarations/common";
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
import { extractTokenFromAuthHeader } from "@utils/stringUtils";

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
          todo
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getTodos: AppRequestHandler<GetTodosResponse> = async (req, res, next) => {
    try {
      const userId = this.getUserId(req.headers.authorization ?? "");
      const todos = await TodoServiceSingleton.getInstance().getTodos(userId);

      res.status(200).json(
        generateResponse({
          todos
        })
      );
    } catch (error) {
      next(error);
    }
  };

  createTodo: AppRequestHandler<CreateTodoResponse, CreateTodoPayload> = async (req, res, next) => {
    try {
      const userId = this.getUserId(req.headers.authorization ?? "");
      let categories: Array<Category> | undefined;

      if (req.body.categories) {
        categories = await CategoryServiceSingleton.getInstance().getCategories(userId);
      }

      const user = await UserServiceSingleton.getInstance().getUserById(userId);
      const todo = await TodoServiceSingleton.getInstance().createTodo(req.body, user, categories);

      res.status(201).json(
        generateResponse({
          todo
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
        categories = await CategoryServiceSingleton.getInstance().getCategories(userId);
      }

      const todo = await TodoServiceSingleton.getInstance().editTodo(req.body, req.params.todoId, categories);

      res.status(200).json(
        generateResponse({
          todo
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
