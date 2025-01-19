import { AppRequestHandler } from "@typeDeclarations/common";
import {
  TodoIdParams,
  CreateTodoPayload,
  CreateTodoResponse,
  DeleteTodoResponse,
  EditTodoPayload,
  EditTodoResponse,
  GetTodosResponse,
  GetTodoResponse
} from "@typeDeclarations/todo";

export interface TodoControllerInterface {
  getTodo: AppRequestHandler<GetTodoResponse, unknown, TodoIdParams>;
  getTodos: AppRequestHandler<GetTodosResponse>;
  createTodo: AppRequestHandler<CreateTodoResponse, CreateTodoPayload>;
  editTodo: AppRequestHandler<EditTodoResponse, EditTodoPayload, TodoIdParams>;
  deleteTodo: AppRequestHandler<DeleteTodoResponse, unknown, TodoIdParams>;
}
